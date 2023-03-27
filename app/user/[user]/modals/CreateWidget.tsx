import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import createButton from "../../../../public/createbutton.png";
import Image from "next/image";
import styles from "../userpage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AddProject, AddWidget } from "../utils/getMethods";

function CreateWidget(props: { projectid: string }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [inputs, setInputs] = useState({
    date: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputs.date.length > 0) {
      setInputs((values) => ({ ...values, date: "" }));
      const date = new Date(inputs.date);
      await AddWidget(date, props.projectid);
      handleClose();
    }
    console.log(inputs.date);
  };

  return (
    <>
      <button onClick={handleShow} className="createwidget__button">
        <Image
          className={styles.createButton}
          src={createButton}
          placeholder="blur"
          alt=""
        />
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a project event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="editmodal" className="form" onSubmit={handleSubmit}>
            <label className="inputLabel">
              {" "}
              Project name:
              <br></br>
              <input
                className="inputField"
                type="date"
                name="date"
                value={inputs.date}
                onChange={handleChange}
              />
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button form="editmodal" className="formButton" type="submit">
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateWidget;