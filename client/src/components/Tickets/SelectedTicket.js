import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Row,
  Col,
  CardTitle,
  CardText,
  Button,
  List,
  Form,
  Input,
} from "reactstrap";
import moment from "moment";
import API from "utils/API";

export default function SelectedTicket({
  selectedTicket,
  assignedDevs,
  comments,
  setComments,
}) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (e) => {
    let { value, name } = e.target;

    setComment((name = value));
  };

  const deleteComment = async (commentId) => {
    try {
      await API.deleteComment(selectedTicket.id, commentId);

      const comments = await API.getTicketComments(selectedTicket.id);
      setComments(comments);
    } catch (err) {
      console.log("Error deleting comment", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await API.createComment(selectedTicket.id, { comment });

      const comments = await API.getTicketComments(selectedTicket.id);
      setComments(comments);
    } catch (err) {
      console.log("Error posting comment", err);
    }

    setIsSubmitting(false);
    setComment("");
  };

  return (
    <>
      <Card className="shadow">
        <CardHeader>
          <h3 className="mb-0">Selected Ticket Info</h3>
        </CardHeader>
        {Object.keys(selectedTicket).length === 0 ? (
          <div className="m-2">No ticket selected</div>
        ) : (
          <>
            <Row className=" p-2">
              <Col xl="6" className="mt-3">
                <Card className="shadow p-4">
                  <h2 className="text-primary mb-1">{selectedTicket.title}</h2>
                  <h5 color="primary" className="mb-3">
                    {selectedTicket.first_name} {selectedTicket.last_name}
                  </h5>
                  <p>{selectedTicket.description}</p>

                  <Row className="justify-content-center mt-3">
                    <Col
                      xl="3"
                      className="mr-1 mb-2 badge badge-primary badge-pill"
                    >
                      {selectedTicket.status}
                    </Col>
                    <Col
                      xl="3"
                      className="mr-1 mb-2 badge badge-primary badge-pill"
                    >
                      {selectedTicket.priority}
                    </Col>
                    <Col
                      xl="3"
                      className="mr-1 mb-2 badge badge-primary badge-pill"
                    >
                      {selectedTicket.type}
                    </Col>
                    <Col xl="3">{selectedTicket.time_estimate}</Col>
                  </Row>
                  <hr className="pt-0" />
                  <h5>Assigned Devs </h5>
                  <List type="unstyled">
                    {assignedDevs ? (
                      assignedDevs.map((dev, index) => {
                        return (
                          <li
                            key={dev.user_id}
                            id={dev.user_id}
                            style={{ listStyleType: "none", padding: 0 }}
                          >
                            {`${dev.first_name} ${dev.last_name}`}
                          </li>
                        );
                      })
                    ) : (
                      <li>No devs assigned</li>
                    )}
                  </List>
                </Card>
              </Col>
              <Col xl="6" className="mt-3">
                <Card className="shadow">
                  <CardHeader className="mb-0">
                    <h4>Comments</h4>
                  </CardHeader>
                  {comments ? (
                    comments.map((comment) => {
                      return (
                        <Card body className="shadow m-3" key={comment.id}>
                          <CardTitle tag="h5">
                            <Row className="justify-content-between">
                              <div>
                                <span id={comment.author_id} className="">
                                  {comment.first_name} {comment.last_name} -{" "}
                                </span>
                                <span className="h6">
                                  {moment(comment.created_at).format(
                                    "MMMM Do YYYY, h:mm:ss a"
                                  )}
                                </span>{" "}
                              </div>

                              <Button
                                className="p-1"
                                color="danger"
                                size="sm"
                                onClick={() => {
                                  deleteComment(comment.id);
                                }}
                              >
                                <span>Delete</span>
                              </Button>
                            </Row>
                          </CardTitle>
                          <CardText>{comment.comment}</CardText>
                        </Card>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  <Row className="m-3">
                    <Form
                      className="input-group"
                      onSubmit={handleCommentSubmit}
                    >
                      <Input
                        id="comment"
                        type="text"
                        name="comment"
                        placeholder="Enter comment"
                        value={comment}
                        onChange={handleCommentChange}
                      />
                      <div className="input-group-append">
                        <Button type="submit" color="primary">
                          Comment
                        </Button>
                      </div>
                    </Form>
                  </Row>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </>
  );
}
