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
import { units, basicUnits, convertToStandard, updateStandardAmount, isVolumeUnit, basicCategories } from "../../utils/conversion"
import "./ReceiptModal.css"

export default function ReceiptModal(props) {
    const receiptScannerUrl = "http://localhost:3001/receipt?"
    const [error, setError] = useState("")
    const [curImageFile, setCurImageFile] = useState(null)
    const [curImageUrl, setCurImageUrl] = useState("")
    const [loadingPercent, setLoadingPercent] = useState(0)
    const [receiptItems, setReceiptItems] = useState([])
    const [uploadingImage, setUploadingImage] = useState(false)
    const [scanningImage, setScanningImage] = useState(false)
    const { userProducts, setUserProducts, ...modalProps } = props

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
                        console.log(url);
                        setCurImageUrl(url)
                    });
                    setUploadingImage(false)
                }
            );
        }
    }, [curImageFile])

    const onImageChange = (event) => {
        let img = event.target.files[0];
        setCurImageFile(img)
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
                console.log(res.data)
                const curItems = res.data.Items.values.map((val) => {
                    let item = {
                        name: val?.properties?.Description?.value || "",
                        quantity: val?.properties?.Quantity?.value || "",
                        unit: basicUnits[0],
                        category: basicCategories[0]
                    }
                    return item
                })
                setReceiptItems(curItems)
            }).catch((error) => {
                console.log(error.message)
            })
        } catch (error) {
            console.log(error.message)
        }
        setScanningImage(false)
    }

    const handleReceiptOutputFormChange = (event, indx) => {
        const curKey = event.target.name
        const newItems = receiptItems.map(i => ({ ...i }))
        newItems[indx][curKey] = event.target.value
        setReceiptItems(newItems)
    }

    const handleEachItemUpdate = (item, products) => {
        let itemIndex = products.findIndex(val => val.name === item.name)
        if (itemIndex == -1) {
            products.push(item)
        } else {
            if (products[itemIndex].unitType != item.unitType) {
                setError("please make sure measurement is correct")
            } else {
                products[itemIndex].quantity += item.quantity
            }
        }
    }

    const handleOnSubmitReceiptForm = () => {
        const newItems = receiptItems.map((val) => {
            const quantityAmount = convertToStandard(val.unit, Number(val.quantity))
            let item = {
                name: val.name.toLowerCase(),
                quantity: quantityAmount[1],
                category: val.category,
                unitType: isVolumeUnit(val.unit)
            }
            return item
        })
        const newProducts = userProducts.map(i => ({ ...i }))
        newItems.forEach((val) => handleEachItemUpdate(val, newProducts))
        setUserProducts(newProducts)
        closeReceiptModal()
    }

    const handleReceiptItemRemove = (indx) => {
        const newReceipt = receiptItems.map(i => ({ ...i }))
        newReceipt.splice(indx, 1)
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

                            {receiptItems.length > 0 &&
                                <div className="receipt-item-grid">
                                    {receiptItems.map((val, indx) => (
                                        <div key={indx} className="receipt-items">
                                            <div>
                                                {indx == 0 && <Form.Label className="receipt-form-label">Product name:</Form.Label>}
                                                <Form.Control type="text" placeholder="Enter name" name="name" value={val?.name} onChange={event => handleReceiptOutputFormChange(event, indx)} style={{ color: "var(--fontContent)" }} />
                                            </div>
                                            <div>
                                            {indx == 0 && <Form.Label className="receipt-form-label">Quantity:</Form.Label>}
                                                <Form.Control type="number" placeholder="Enter quantity" name="quantity" value={val?.quantity} onChange={event => handleReceiptOutputFormChange(event, indx)} style={{ color: "var(--fontContent)" }} />
                                            </div>
                                            <div>
                                                {indx == 0 && <Form.Label className="receipt-form-label">Unit:</Form.Label>}
                                                <Form.Select name="unit" value={val?.unit} onChange={event => handleReceiptOutputFormChange(event, indx)} style={val?.unit == basicUnits[0] ? { color: "gray" } : { color: "var(--fontContent" }}>
                                                    {basicUnits.map((unitVal, ind) => (
                                                        <option key={unitVal} value={unitVal} disabled={ind == 0} hidden={ind == 0}>{unitVal}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                            <div>
                                                {indx == 0 && <Form.Label className="receipt-form-label">Category:</Form.Label>}
                                                <Form.Select name="category" value={val?.category} onChange={event => handleReceiptOutputFormChange(event, indx)} style={val?.category == basicCategories[0] ? { color: "gray" } : { color: "var(--fontContent" }}>
                                                    {basicCategories.map((catVal, ind) => (
                                                        <option key={catVal} value={catVal} disabled={ind == 0} hidden={ind == 0}>{catVal}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                            <div>
                                                <Button className="receipt-item-remove" onClick={() => handleReceiptItemRemove(indx)}><AiOutlineClose /></Button>
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