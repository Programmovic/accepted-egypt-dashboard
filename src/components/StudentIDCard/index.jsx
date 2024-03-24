import React, { useState } from "react";
import { Modal, Button, Row } from "react-bootstrap";
import Barcode from "react-barcode";
import { Print } from "print-react";
import { useRef } from "react";
import { useQRCode } from "next-qrcode";

const IdentityCard = ({
  studentData,
  showIdentityModal,
  setShowIdentityModal,
}) => {
  const ref = useRef();
  const { Canvas } = useQRCode();
  return (
    <div>
      <Modal
        show={showIdentityModal}
        onHide={() => setShowIdentityModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{studentData.name} ID</Modal.Title>
        </Modal.Header>
        <Print ref={ref} printWidth={"100%"} marginTop={48} marginLeft={64}>
          <Modal.Body>
            <Row className="justify-content-center">
              <Canvas
                text={studentData._id}
                options={{
                  errorCorrectionLevel: "M",
                  margin: 3,
                  scale: 10,
                  width: 400,
                  color: {
                    dark: "#000",
                    light: "#dcdcdc",
                  },
                }}
              />
              <h4 className="fw-bold text-center my-5 text-uppercase">{studentData.name}</h4>
              <Barcode value={studentData._id} />
            </Row>
            {/* Additional content for the body of the modal if needed */}
          </Modal.Body>
        </Print>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowIdentityModal(false)}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              await ref.current.openPrintDialog();
            }}
          >
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IdentityCard;
