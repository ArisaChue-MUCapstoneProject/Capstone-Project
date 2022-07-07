import * as React from "react"
import Modal from "react-bootstrap/Modal"
import { Container, Row, Col, Button } from "react-bootstrap" 
import "./RecipeModal.css"

export default function RecipeModal(props) {
    if (!props.show) {
        return null
    }
    return (
      <Modal {...props} scrollable={true} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            {/* first row - recipe overview */}
            <Row className="modal-overview">
                <Col>
                Serving Time: {props.recipeinfo.readyInMinutes} mins
                </Col>
                <Col>
                Servings: {props.recipeinfo.servings}
                </Col>
            </Row>
            {/* recipe content */}
            <Row>
                {/* ingredient content */}
                <Col>
                    <p className="modal-headings">Ingredients:</p>
                    {
                        props.recipeinfo.extendedIngredients.map((ingredient) => (
                            <p key={ingredient.id}>* {ingredient.original}</p>
                        ))
                    }
                </Col>
                {/* instructions content */}
                <Col>
                    <p className="modal-headings">Steps:</p>
                    {
                        props.instructions[0].steps.map((curStep) => (
                            <p key={curStep.number}>{curStep.number}. {curStep.step}</p>
                        ))
                    }
                </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }