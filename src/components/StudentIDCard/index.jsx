import React, { useState } from "react";
import { Modal, Button, Row } from "react-bootstrap";
import Barcode from "react-barcode";
import { Print } from "print-react";
import { useRef } from "react";
import { useQRCode } from "next-qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const IdentityCard = ({
  studentData,
  showIdentityModal,
  setShowIdentityModal,
}) => {
  const ref = useRef();
  const { Canvas } = useQRCode();

  // Background image URL
  const backgroundImageUrl = "/assets/img/pro.jpeg";

  const handleDownloadPDF = async () => {
    try {
      const modalContent = document.getElementById("modal-content");

      const canvas = await html2canvas(modalContent);
      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save("identity_card.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDownloadImage = async () => {
    try {
      const modalContent = document.getElementById("modal-content");

      const canvas = await html2canvas(modalContent);
      const imageData = canvas.toDataURL("image/png");

      // Create a link element
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `${studentData.name}_ID.png`; // Specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

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
          <Modal.Body id="modal-content">
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
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 100
                }}
                className="rounded-circle"
              >
                <Canvas
                  text={studentData._id}
                  options={{
                    errorCorrectionLevel: "M",
                    margin: 1,
                    scale: 10,
                    width: 350,
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
          <Button variant="secondary" onClick={handleDownloadImage}>
            Download Image
          </Button>
          <Button variant="secondary" onClick={handleDownloadPDF}>
            Download PDF
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
