import React, { useState, useEffect } from "react";
import API from "../../utils/API";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

const AddTeamMember = (props) => {
  const { projectId } = props;
  const [dbUsers, setDbUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const users = await API.getAvailableUsers(projectId);
      console.log(users);

      setDbUsers(users);
    }

    fetchData();
  }, []);

  const handleChange = (event) => {
    let values = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setSelectedUsers(values);
  };

  const submit = (e) => {
    e.preventDefault();

    selectedUsers.forEach(async (userId) => {
      await API.addTeamMember(projectId, userId);
    });

    props.toggle();
  };

  return (
    <Container>
      <Form onSubmit={submit}>
        <FormGroup>
          <Label>Available Users</Label>
          <Input
            type="select"
            name="availableUsers"
            value={selectedUsers}
            onChange={handleChange}
            multiple
          >
            {dbUsers.map((user, key) => {
              return (
                <option key={key} id={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              );
            })}
          </Input>
          <Button type="submit" color="success" className="mt-4">
            Add Selected Devs to Team
          </Button>
        </FormGroup>
      </Form>
    </Container>
  );
};

export default AddTeamMember;