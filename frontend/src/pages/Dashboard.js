// src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import { Container, Row, Col, Card, Button, Form, Table } from "react-bootstrap";
import StatusPieChart from "../components/StatusPieChart";
import PriorityBarChart from "../components/PriorityBarChart";
import debounce from "lodash.debounce";
import moment from "moment";

export default function Dashboard() {
  const navigate = useNavigate();

  // Single state for all table data + summary stats
  const [tasksData, setTasksData] = useState({
    tasks:          [],
    page:           1,
    totalPages:     1,
    totalItems:     0,
    completedItems: 0,
    overdueItems:   0
  });

  const [userRole, setUserRole] = useState("");
  const [userId, setUserId]     = useState("");
  const [filters, setFilters]   = useState({
    page:     1,
    limit:    10,
    status:   "",
    priority: "",
    search:   ""
  });

  // Infinite-scroll sentinel
  const [hasMore, setHasMore] = useState(true);
  const observerRef          = useRef(null);

  // Debounced search so we don’t fire on every keystroke
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setFilters(f => ({ ...f, search: value, page: 1 }));
      }, 300),
    []
  );
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  // Fetch paginated & filtered table data + summary stats
  useEffect(() => {
    const qs = new URLSearchParams(filters).toString();
    axios
      .get(`/tasks?${qs}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(res => {
        const { tasks, page, totalPages, totalItems, completedItems, overdueItems, user } = res.data;
        setTasksData({ tasks, page, totalPages, totalItems, completedItems, overdueItems });
        setUserRole(user.role);
        setUserId(user._id);
        // If fewer than limit tasks returned, disable infinite scroll
        if (tasks.length < filters.limit) setHasMore(false);
      })
      .catch(console.error);
  }, [filters]);

  // Infinite-scroll observer to load next page
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setFilters(f => ({ ...f, page: f.page + 1 }));
        }
      },
      { threshold: 1 }
    );
    const target = observerRef.current;
    if (target) obs.observe(target);
    return () => target && obs.unobserve(target);
  }, [hasMore]);

  // Delete handler updates only tasksData
  const handleDelete = async id => {
  try {
    await axios.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setTasksData(prev => {
      // Find the task we’re deleting so we know its status
      const deletedTask = prev.tasks.find(task => task._id === id) || {};

      return {
        ...prev,
        // Remove it from the array
        tasks: prev.tasks.filter(task => task._id !== id),
        // Decrement total count
        totalItems: prev.totalItems - 1,
        // Decrement completedItems if it was completed
        completedItems:
          deletedTask.status === "completed"
            ? prev.completedItems - 1
            : prev.completedItems,
        // Decrement overdueItems if it was overdue
        overdueItems:
          deletedTask.status === "overdue"
            ? prev.overdueItems - 1
            : prev.overdueItems
      };
    });
  } catch {
    alert("Delete failed. Please try again.");
  }
};

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        {/* Header */}
        <Row className="align-items-center mb-3">
          <Col><h2>📋 Dashboard</h2></Col>
          <Col className="text-end">
            {userRole === "admin" && (
              <Button variant="outline-primary" className="me-2" onClick={() => navigate("/manage-users")}>
                Manage Users
              </Button>
            )}
            <Button variant="success" onClick={() => navigate("/create-task")}>
              + Add Task
            </Button>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card bg="light">
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <Card.Text>{tasksData.totalItems}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card bg="light">
              <Card.Body>
                <Card.Title>Completed</Card.Title>
                <Card.Text>{tasksData.completedItems}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card bg="light">
              <Card.Body>
                <Card.Title>Overdue</Card.Title>
                <Card.Text>{tasksData.overdueItems}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filter Bar */}
        <Form className="row g-2 mb-3" onSubmit={e => e.preventDefault()}>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search tasks"
              defaultValue={filters.search}
              onChange={e => debouncedSearch(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={filters.priority}
              onChange={e => setFilters(f => ({ ...f, priority: e.target.value, page: 1 }))}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Col>
        </Form>

        {/* Tasks Table */}
        <Table hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasksData.tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">No tasks found</td>
              </tr>
            ) : (
              tasksData.tasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td>{moment(task.dueDate).format("YYYY-MM-DD")}</td>
                  <td>
                    {(task.createdBy === userId || userRole === "admin") && (
                      <>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => navigate(`/edit-task/${task._id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Charts */}
        <Row className="mt-5">
          <Col md={6}>
            <StatusPieChart tasks={tasksData.tasks} />
          </Col>
          <Col md={6}>
            <PriorityBarChart tasks={tasksData.tasks} />
          </Col>
        </Row>

        {/* Infinite-scroll sentinel */}
        {hasMore && <div ref={observerRef} style={{ height: 30 }} />}
      </Container>
    </>
  );
}
