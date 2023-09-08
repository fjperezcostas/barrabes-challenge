import React, { useEffect } from 'react';
import { Button, Col, Container, Row, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function CheckMail() {

    const navigate = useNavigate()

    useEffect(() => { document.title = 'Necesitamos validar tu e-mail'}, [])

    return (
        <Container className="mt-5">
            <Row className='mb-3 d-flex justify-content-center'>
                <Col md='3' className='d-flex justify-content-center'>
                    <Image src='barrabes.png' rounded fluid />
                </Col>
            </Row>
            <Row className='mb-3 d-flex justify-content-center'>
                <Col>
                    <h4 className='text-center'>Revisa tu e-mail para obtener el token de registro</h4>
                </Col>
            </Row>
            <Row className='mb-3 d-flex justify-content-center'>
                <Col md='2' className='d-flex justify-content-center'>
                    <Button variant='primary' onClick={() => { navigate('/validate-token') }}>Continuar</Button>
                </Col>
            </Row>
        </Container>
    )
}
