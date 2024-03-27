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

  // Background image URL
  const backgroundImageUrl = "/assets/img/pro.jpeg";

  return (
    <div>
      <Modal
        show={showIdentityModal}
        onHide={() => setShowIdentityModal(false)}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{studentData.name} ID</Modal.Title>
        </Modal.Header>
        <Print ref={ref} printWidth={"100%"} marginTop={48} marginLeft={64}>
          <Modal.Body>
            <Row className="justify-content-center">
              <img
                src={backgroundImageUrl}
                alt="Background"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                }}
                className="rounded-3"
              />
              <div
                style={{
                  zIndex: -1,
                  display: "flex",
                  justifyContent: "center",
                }}
                className="rounded-circle"
              >
                <Canvas
                  text={studentData._id}
                  options={{
                    errorCorrectionLevel: "M",
                    margin: 4,
                    scale: 10,
                    width: 400,
                    color: {
                      dark: "#000",
                      light: "#dcdcdc",
                    },
                  }}
                />
              </div>
              <h4
                className="fw-bold text-center my-5 text-uppercase"
                style={{ zIndex: 2 }}
              >
                {studentData.name}
              </h4>
              <Barcode
                value={studentData._id}
                background="#eeeeee6b"
                displayValue="true"
                width={1.5}
              />
            </Row>
            {/* Additional content for the body of the modal if needed */}
          </Modal.Body>
        </Print>

        <Modal.Footer className="mt-4">
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
