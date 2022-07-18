import * as React from "react"
import Modal from "react-bootstrap/Modal"
import { Container, Row, Col, Button } from "react-bootstrap" 
import "./RecipeModal.css"

export default function RecipeModal(props) {
    if (!props.show) {
        return null
    }
    const { recipeInfo, ...modalProps } = props
    const validMins = !(recipeInfo.readInMinutes == undefined)
    const validServings = !(recipeInfo.servings == undefined)
    const validIngred = !(recipeInfo.extendedIngredients == undefined)
    const validSteps = !(recipeInfo.analyzedInstructions == undefined || recipeInfo.analyzedInstructions[0].steps == undefined)
    
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
              {validMins && (<Col> Total Time: {recipeInfo.readyInMinutes} mins </Col>)}
              {validServings && (<Col> Servings: {recipeInfo.servings} mins </Col>)} 
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