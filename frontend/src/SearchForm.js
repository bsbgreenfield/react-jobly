import React, { useState } from "react";
import { Form, Row, Col, Button } from "reactstrap";

function SearchForm({ filter }) {
    const [formData, setFormData] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        filter(formData)
        setFormData('')
    }

    const handleChange = (e) => {
        setFormData(e.target.value)
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="row-cols-lg-auto g-3 align-items-center">
                <Col>
                    <label style={{marginLeft: "5px"}} htmlFor="filter">Keyword: </label>
                    <input style={{marginLeft: "5px"}} type="text" name="filter" id="filter" value={formData} onChange={handleChange} />
                    <Button style={{marginLeft: "5px"}} color="primary" type="submit">Submit</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SearchForm