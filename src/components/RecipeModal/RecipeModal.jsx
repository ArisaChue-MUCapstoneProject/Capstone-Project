import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import { Container, Row, Col, Button, Alert } from "react-bootstrap" 
import "./RecipeModal.css"

export default function RecipeModal(props) {
    if (!props.show) {
        return null
    }
    const { recipeInfo, userDiets, addIngredientToCart, modalError, ...modalProps } = props
    const validMins = !(recipeInfo.readInMinutes == undefined)
    const validServings = !(recipeInfo.servings == undefined)
    const validIngred = !(recipeInfo.extendedIngredients == undefined)
    const validSteps = !(recipeInfo.analyzedInstructions == undefined || recipeInfo.analyzedInstructions.length == 0 || recipeInfo.analyzedInstructions[0].steps == undefined)
    const dietsWarning = userDiets.filter(value => !recipeInfo.diets.includes(value)) || []
    const warning = dietsWarning.length 
      ? (`Caution: ${dietsWarning.join(", ")} dietary restriction(s) are not followed for this recipe`)
      : ""
    
    return (
      <Modal {...modalProps} scrollable={true} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {recipeInfo.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>
              {modalError && <Alert variant="danger">{modalError}</Alert>}
            </Row>
            <Row>
              {warning && <Alert variant="warning">{warning}</Alert>}
            </Row>
            {/* first row - recipe overview */}
            <Row className="modal-overview">
              {validMins && (<Col> Total Time: {recipeInfo.readyInMinutes} mins </Col>)}
              {validServings && (<Col> Servings: {recipeInfo.servings} </Col>)} 
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
                                <div key={ingredient.id}>
                                  <p>* {ingredient.original}</p>
                                  <Button onClick={() => addIngredientToCart(ingredient.name)}>Add to list</Button>
                                </div>
                            ))
                          }
                      </div>
                      : <p> Please visit this <a href={recipeInfo.sourceUrl} target="_blank">link</a> for ingredients</p>
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
                      : <p> Please visit this <a href={recipeInfo.sourceUrl} target="_blank">link</a> for steps</p>
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