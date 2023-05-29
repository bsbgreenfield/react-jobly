"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
const app = require("../app");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password, firstName, lastName, email, isAdmin }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT users.username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin",
                  job_id
           FROM users
           LEFT JOIN applications
           ON users.username = applications.username
           ORDER BY users.username`,
    );
    let currUser = result.rows[0].username;
    let resp = [{
      "username": result.rows[0].username,
      "firstName":result.rows[0].firstName,
      "lastName": result.rows[0].lastName,
      "email": result.rows[0].email,
      "isAdmin": result.rows[0].isAdmin,
      "applications" : []
    }];
    for (let userObj of result.rows){
      // if the current object is for the same user, just add the job_id to applications array of the last object
      if (userObj.username == currUser){
        resp[resp.length - 1].applications.push(userObj.job_id)
      }
      // otherwise, create a new object
      else{
        resp.push({
          "username": userObj.username,
          "firstName":userObj.firstName,
          "lastName": userObj.lastName,
          "email": userObj.email,
          "isAdmin": userObj.isAdmin,
          "applications" : userObj.job_id != null ? [userObj.job_id] : []
        })
      }
    }
    return resp;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT users.username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin",
                  applications.job_id AS job_id
           FROM users
           LEFT JOIN applications
           ON users.username = applications.username
           WHERE users.username = $1`,
        [username],
    );
    if (!userRes.rows[0]) throw new NotFoundError(`No user: ${username}`);
    const user = {
      "username": userRes.rows[0].username,
      "firstName":userRes.rows[0].firstName,
      "lastName": userRes.rows[0].lastName,
      "email": userRes.rows[0].email,
      "isAdmin": userRes.rows[0].isAdmin,
    };

    const applications = []
    for (let row of userRes.rows){
      applications.push(row.job_id)
    }
    console.log("#######################", {user, "applications": applications} )
    return {user, "applications": applications};
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
          isAdmin: "is_admin",
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    return user;
  }

  static async apply(username, jobId){
    let validJob = await db.query(
      `
      SELECT id FROM jobs WHERE id = $1
      `, [jobId]
    )
    if(!validJob.rows[0]){
      throw new BadRequestError("no such job", 401)
    }
    let result = await db.query(
      `
      INSERT INTO applications (username, job_id)
      VALUES($1, $2)
      `, [username, jobId]
    )
    return {"applied": jobId}
  }

  
}


module.exports = User;
