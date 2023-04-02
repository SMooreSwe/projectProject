import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import createButton from "../../../../public/createbutton.png";
import Image from "next/image";
import styles from "../userpage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AddProject } from "../utils/getMethods";

function CreateProject(props: {
  user: { email: string; username: string; userid: string };
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [inputs, setInputs] = useState({
    projectname: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputs.projectname.length > 0) {
      setInputs((values) => ({ ...values, projectname: "" }));
      await AddProject(inputs.projectname, props.user.userid);
      handleClose();
    }
  };

  return (
    <>
      <button className="createProjectBtn" onClick={handleShow}>
        <p className="createProjectBtn__plus">+</p>
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="editmodal" className="form" onSubmit={handleSubmit}>
            <label className="inputLabel">
              {" "}
              Project name:
              <br></br>
              <input
                className="inputField"
                type="text"
                name="projectname"
                value={inputs.projectname}
                onChange={handleChange}
              />
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button form="editmodal" className="formButton-create" type="submit">
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateProject;
