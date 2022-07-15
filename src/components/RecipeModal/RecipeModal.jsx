import * as React from "react"
import Modal from "react-bootstrap/Modal"
import { Container, Row, Col, Button } from "react-bootstrap" 
import "./RecipeModal.css"

export default function RecipeModal(props) {
    if (!props.show) {
        return null
    }
    const { recipeInfo, ...modalProps } = props
    var validMins = true
    var validServings = true
    var validIngred = true
    var validSteps = true
    if (recipeInfo.readyInMinutes == undefined) {
      validMins = false
    }
    if (recipeInfo.servings == undefined) {
      validServings = false
    }
    if (recipeInfo.extendedIngredients == undefined) {
      validIngred = false
    }
    if (recipeInfo.analyzedInstructions == undefined || recipeInfo.analyzedInstructions[0].steps == undefined) {
      validSteps = false
    }
    
    return (
      <Modal {...modalProps} scrollable={true} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {recipeInfo.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            {/* first row - recipe overview */}
            <Row className="modal-overview">
              {validMins 
                ? <Col> Total Time: {recipeInfo.readyInMinutes} mins </Col>
                : null
              }
              {validServings 
                ? <Col> Servings: {recipeInfo.servings} mins </Col>
                : null
              } 
            </Row>
            {/* recipe content */}
            <Row>
                {/* ingredient content */}
                <Col>
                    <p className="modal-headings">Ingredients:</p>
                    {validIngred
                      ? <div>
                          {
                            recipeInfo.extendedIngredients.map((ingredient) => (
                                <p key={ingredient.id}>* {ingredient.original}</p>
                            ))
                          }
                      </div>
                      : <p> No ingredients listed</p>
                    }
                </Col>
                {/* instructions content */}
                <Col>
                    <p className="modal-headings">Steps:</p>
                    {validSteps
                      ? <div>
                          {
                            // props.instructions is array of instruction Objects, main instruction is at index 0
                            recipeInfo.analyzedInstructions[0].steps.map((curStep) => (
                                <p key={curStep.number}>{curStep.number}. {curStep.step}</p>
                            ))
                          }
                        </div>
                      : <p> No steps listed</p>
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