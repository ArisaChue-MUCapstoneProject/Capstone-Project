import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import { BsDot } from 'react-icons/bs'
import { Container, Row, Col, Button, Alert } from "react-bootstrap"
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PacmanLoader from "react-spinners/PacmanLoader";
import { units, basicUnits, convertToStandard, updateStandardAmount, isVolumeUnit, basicCategories } from "../../utils/conversion"
import "./RecipeModal.css"

export default function RecipeModal(props) {
  if (!props.show) {
    return null
  }
  if (props.isIngredLoading) {
    return <PacmanLoader color="var(--green3)" loading={props.isIngredLoading} size={35} className="loader" />
  }
  const { recipeInfo, userDiets, addIngredientToCart, modalError, ingredientInfo, isIngredLoading, useRecipe, ...modalProps } = props
  const validMins = !(recipeInfo.readyInMinutes == undefined || recipeInfo.readyInMinutes.length == 0)
  const validServings = !(recipeInfo.servings == undefined || recipeInfo.servings.length == 0)
  const validIngred = !(recipeInfo.extendedIngredients == undefined || recipeInfo.extendedIngredients.length == 0)
  const validSteps = !(recipeInfo.analyzedInstructions == undefined || recipeInfo.analyzedInstructions.length == 0 || recipeInfo.analyzedInstructions[0].steps == undefined)
  const dietsWarning = userDiets.filter(value => !recipeInfo.diets.includes(value)) || []
  const warning = dietsWarning.length
    ? (`Caution: ${dietsWarning.join(", ")} dietary restriction(s) are not followed for this recipe`)
    : ""

  function useRecipeAndClose() {
    useRecipe()
    props.onHide()
  }

  console.log(recipeInfo.extendedIngredients)

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
          {modalError.length > 0 && <Alert variant="danger">{modalError.map((message, index) => <p key={index} className="remove-margin">{message}</p>)}</Alert>}
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
                      <div className="modal-ingreds" key={ingredient.id}>
                        {/* checking if user has each ingredient */}
                        {ingredientInfo.find(ingred => ingred[0] === ingredient.id)
                          ? <div className="modal-ingred-name">
                            <p style={{ color: "green" }}><BsDot />{ingredient.original}</p>
                            <p className="modal-ingred-message">{ingredientInfo.find(ingred => ingred[0] === ingredient.id)[2]}</p>
                          </div>
                          : <p className="modal-ingred-name" style={{ color: "red" }}><BsDot />{ingredient.original}</p>
                        }
                        <DropdownButton id="dropdown-item-button" title="Add">
                          {basicCategories.map((val, ind) => (
                            <Dropdown.Item as="button" key={val} disabled={ind == 0} onClick={() => addIngredientToCart(ingredient.name, val, ingredient?.measures?.us?.amount, ingredient?.measures?.us?.unitShort)}>{val}</Dropdown.Item>
                          ))}
                        </DropdownButton>
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
        <Button onClick={useRecipeAndClose}>Use Recipe?</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}