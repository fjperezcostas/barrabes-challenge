import React, { useEffect } from 'react';
import { Col, Container, Row, Image } from 'react-bootstrap';


export default function SignUpCompleted() {

    useEffect(() => { document.title = 'Fin del registro'}, [])

    return (
        <Container className="mt-5">
            <Row className='mb-3 d-flex justify-content-center'>
                <Col md='3' className='d-flex justify-content-center'>
                    <Image src='barrabes.png' rounded fluid />
                </Col>
            </Row>
            <Row className='mb-3 d-flex justify-content-center'>
                <Col>
                    <h4 className='text-center'>¡Registro finalizado correctamente!</h4>
                </Col>
            </Row>
        </Container>
    )
}
