import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import { BsDot } from 'react-icons/bs'
import { Container, Row, Col, Button, Alert } from "react-bootstrap"
import PacmanLoader from "react-spinners/PacmanLoader";
import { useEffect } from "react"
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage"
import { storage } from "../../firebase"
import "./ReceiptModal.css"

export default function ReceiptModal(props) {
    const receiptScannerUrl = "http://localhost:3001/receipt?"
    const [error, setError] = useState("")
    const [curImageFile, setCurImageFile] = useState(null)
    const [curImageUrl, setCurImageUrl] = useState("")
    const [loadingPercent, setLoadingPercent] = useState(0)

    useEffect(() => {
        if (curImageFile != null) {
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
                }
            );
        }
    }, [curImageFile])

    const onImageChange = (event) => {
        let img = event.target.files[0];
        setCurImageFile(img)
    }

    const handleScanReceipt = async () => {
        try {
            let imageObject = {
                url: curImageUrl
            }
            axios.post(receiptScannerUrl, imageObject).then((res) => {
                console.log(res.data)
            }).catch((error) => {
                console.log(error.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div>
            {props.show && <Modal {...props} scrollable={true} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
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
                            <h1>Select Image</h1>
                            <input type="file" name="receiptImage" onChange={onImageChange} />
                            {loadingPercent > 0 && <p>uploading {loadingPercent}% done</p>}
                            {curImageUrl && <Button onClick={handleScanReceipt}>Scan this receipt?</Button>}
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>}
        </div>

    );
}