import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import { BsDot } from 'react-icons/bs'
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai'
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap"
import PacmanLoader from "react-spinners/PacmanLoader";
import { useEffect } from "react"
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage"
import { storage } from "../../firebase"
import { units, basicUnits, convertToStandard, updateStandardAmount, isVolumeUnit, basicCategories, UNIT_TYPE } from "../../utils/conversion"
import "./ReceiptModal.css"

export default function ReceiptModal(props) {
    const receiptScannerUrl = "http://localhost:3001/receipt?"
    const [error, setError] = useState("")
    const [errorForm, setErrorForm] = useState([])
    const [curImageFile, setCurImageFile] = useState(null)
    const [curImageUrl, setCurImageUrl] = useState("")
    const [loadingPercent, setLoadingPercent] = useState(0)
    const [receiptItems, setReceiptItems] = useState([])
    const [uploadingImage, setUploadingImage] = useState(false)
    const [scanningImage, setScanningImage] = useState(false)
    const { userProducts, setUserProducts, ...modalProps } = props

    function clearErrorForm() {
        setErrorForm([])
      }

    useEffect(() => {
        if (curImageFile != null) {
            setUploadingImage(true)
            const imageRef = ref(storage, `images/${curImageFile.name}`)
            const uploadTask = uploadBytesResumable(imageRef, curImageFile);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    // update progress
                    setLoadingPercent(percent);
                },
                (err) => console.log(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setCurImageUrl(url)
                    });
                    setUploadingImage(false)
                }
            );
        }
    }, [curImageFile])

    const onImageChange = (event) => {
        setCurImageFile(event.target.files[0])
    }

    const handleReceiptRemove = () => {
        setCurImageUrl("")
        setCurImageFile(null)
        setLoadingPercent(0)
    }

    const handleScanReceipt = async () => {
        try {
            setScanningImage(true)
            let imageObject = {
                url: curImageUrl
            }
            await axios.post(receiptScannerUrl, imageObject).then((res) => {
                const curItems = res.data.Items.values.map((val) => {
                    return {
                        name: val?.properties?.Description?.value || "",
                        quantity: val?.properties?.Quantity?.value || "",
                        unit: basicUnits[0],
                        category: basicCategories[0]
                    }
                })
                setReceiptItems(curItems)
            }).catch((error) => {
                setError(error.message)
            })
        } catch (error) {
            setError(error.message)
        }
        setScanningImage(false)
    }

    const handleReceiptOutputFormChange = (event, indx) => {
        const curKey = event.target.name
        const newItems = receiptItems.map(i => ({ ...i }))
        newItems[indx][curKey] = event.target.value
        setReceiptItems(newItems)
    }

    const handleEachItemUpdate = (item, index, products, errors) => {
        if (item.quantity < 1) {
            errors.push(`Item ${index+1}: quantity must be a positive number`)
            return
        }
        const itemIndex = products.findIndex(val => val.name === item.name)
        if (itemIndex == -1) {
            products.push(item)
        } else {
            if (products[itemIndex].unitType != item.unitType) {
                let curUnitError = "Please make sure you are adding a ["
                curUnitError += products[itemIndex].unitType == UNIT_TYPE.VOLUME ? "volume" : products[itemIndex].unitType == UNIT_TYPE.WEIGHT ? "weight" : "count/misc"
                curUnitError += "] unit type"
                errors.push(`Item ${index+1}: ${curUnitError}`)
            } else {
                products[itemIndex].quantity += item.quantity
            }
        }
    }

    const handleOnSubmitReceiptForm = () => {
        clearErrorForm()
        let errorString = "We are missing info for items:"
        const newItems = receiptItems.map((val, index) => {
            // error handling when user hasn't filled out form
            if (val.category == basicCategories[0] || val.unit == basicUnits[0] || val.name.length == 0 || val.quantity.length == 0) {
                errorString += ` ${index+1}`
            } else {
                const quantityAmount = convertToStandard(val.unit, Number(val.quantity))
                return {
                    name: val.name.toLowerCase(),
                    quantity: quantityAmount[1],
                    category: val.category,
                    unitType: isVolumeUnit(val.unit)
                }
            }
        })
        if (errorString != "We are missing info for items:") {
            setErrorForm([`${errorString}`])
            return
        }
        let itemErrors = ["Please check the following items:"]
        const newProducts = userProducts.map(i => ({ ...i }))
        newItems.forEach((val, index) => handleEachItemUpdate(val, index, newProducts, itemErrors))
        if (itemErrors.length > 1) {
            setErrorForm(itemErrors)
        } else {
            setUserProducts(newProducts)
            closeReceiptModal()
        }
    }

    const handleReceiptItemRemove = (index) => {
        clearErrorForm()
        if (index >= receiptItems.length || index < 0) {
            setErrorForm(["Unable to remove nonexisting item"])
            return
        }
        const newReceipt = receiptItems.map(i => ({ ...i }))
        newReceipt.splice(index, 1)
        setReceiptItems(newReceipt)
    }

    const closeReceiptModal = () => {
        setCurImageFile(null)
        setCurImageUrl("")
        setLoadingPercent(0)
        setReceiptItems([])
        setError("")
        setScanningImage(false)
        setUploadingImage(false)
        props.onHide()
    }

    return (
        <div className="receipt-modal-content">
            {props.show && <Modal {...modalProps} onHide={closeReceiptModal} scrollable={true} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upload Receipt Image
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    <Container>
                        <Row>
                            {error && <Alert variant="danger">{error}</Alert>}
                        </Row>
                        <Row>
                            <img src={curImageUrl} />
                            {curImageFile == null && <input type="file" name="receiptImage" onChange={onImageChange} />}
                            <PacmanLoader color="var(--green3)" loading={uploadingImage} size={20} className="loader" />
                            {loadingPercent > 0 && loadingPercent < 100 && <p>uploading {loadingPercent}% done</p>}
                            {curImageUrl &&
                                <div className="receipt-image-buttons">
                                    <Button onClick={handleReceiptRemove}>Choose another picture?</Button>
                                    <Button disabled={scanningImage} onClick={handleScanReceipt}>Scan this receipt?</Button>
                                </div>
                            }
                            <PacmanLoader color="var(--green3)" loading={scanningImage} size={20} className="loader" />
                        </Row>
                        <Row>
                            {errorForm.length > 0 && <Alert variant="danger">{errorForm.map((message, index) => <p key={index} className="remove-margin">{message}</p>)}</Alert>}
                            {receiptItems.length > 0 &&
                                <div className="receipt-item-grid">
                                    {receiptItems.map((val, index) => (
                                        <div key={index} className="receipt-items">
                                            <p className="receipt-item-bullet">{index+1}.</p>
                                            <div>
                                                {index == 0 && <Form.Label className="receipt-form-label">Product name:</Form.Label>}
                                                <Form.Control type="text" placeholder="Enter name" name="name" value={val?.name} onChange={event => handleReceiptOutputFormChange(event, index)} style={{ color: "var(--fontContent)" }} />
                                            </div>
                                            <div>
                                            {index == 0 && <Form.Label className="receipt-form-label">Quantity:</Form.Label>}
                                                <Form.Control type="number" placeholder="Enter quantity" name="quantity" value={val?.quantity} onChange={event => handleReceiptOutputFormChange(event, index)} style={{ color: "var(--fontContent)" }} />
                                            </div>
                                            <div>
                                                {index == 0 && <Form.Label className="receipt-form-label">Unit:</Form.Label>}
                                                <Form.Select name="unit" value={val?.unit} onChange={event => handleReceiptOutputFormChange(event, index)} style={val?.unit == basicUnits[0] ? { color: "gray" } : { color: "var(--fontContent" }}>
                                                    {basicUnits.map((unitVal, ind) => (
                                                        <option key={unitVal} value={unitVal} disabled={ind == 0} hidden={ind == 0}>{unitVal}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                            <div>
                                                {index == 0 && <Form.Label className="receipt-form-label">Category:</Form.Label>}
                                                <Form.Select name="category" value={val?.category} onChange={event => handleReceiptOutputFormChange(event, index)} style={val?.category == basicCategories[0] ? { color: "gray" } : { color: "var(--fontContent" }}>
                                                    {basicCategories.map((catVal, ind) => (
                                                        <option key={catVal} value={catVal} disabled={ind == 0} hidden={ind == 0}>{catVal}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                            <div>
                                                <Button className="receipt-item-remove" onClick={() => handleReceiptItemRemove(index)}><AiOutlineClose /></Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button onClick={handleOnSubmitReceiptForm}>Update Pantry?</Button>
                                </div>

                            }

                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeReceiptModal}>Close</Button>
                </Modal.Footer>
            </Modal>}
        </div>

    );
}