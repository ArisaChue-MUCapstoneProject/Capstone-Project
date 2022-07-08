import * as React from "react"
import Modal from "react-bootstrap/Modal"
import { Container, Row, Col, Button } from "react-bootstrap" 
import "./RecipeModal.css"

export default function RecipeModal(props) {
    if (!props.show) {
        return null
    }
    const { recipeInfo, instructions, title, ...modalProps } = props
    return (
      <Modal {...modalProps} scrollable={true} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            {/* first row - recipe overview */}
            <Row className="modal-overview">
                <Col>
                Total Time: {recipeInfo.readyInMinutes} mins
                </Col>
                <Col>
                Servings: {recipeInfo.servings}
                </Col>
            </Row>
            {/* recipe content */}
            <Row>
                {/* ingredient content */}
                <Col>
                    <p className="modal-headings">Ingredients:</p>
                    {
                        recipeInfo.extendedIngredients.map((ingredient) => (
                            <p key={ingredient.id}>* {ingredient.original}</p>
                        ))
                    }
                </Col>
                {/* instructions content */}
                <Col>
                    <p className="modal-headings">Steps:</p>
                    {
                        // props.instructions is array of instruction Objects, main instruction is at index 0
                        instructions[0].steps.map((curStep) => (
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