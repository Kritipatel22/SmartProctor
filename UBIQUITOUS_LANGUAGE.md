# Ubiquitous Language --- SmartProctor

## 1. About the Project And Purpose

SmartProctor is our online examination system. Students can take exams 
through the application, and administrators can manage exams and questions. 
The project also includes login, result handling, and activity monitoring.

This document defines the terms used by the team when
discussing the online examination system. The aim is to use the same
words consistently in code, API routes, database documents, diagrams,
and team discussions.

## 2. Users and Authentication

### User

An account stored in MongoDB and used to access SmartProctor. The
authentication response includes an ID, name, email, role, and optional
avatar.

### Student

A user who takes an examination. The supplied files do not define a
separate Student model; student access is represented through user
information and roles.

### Administrator

A user whose role is `admin` in the exam routes. The exam routes check
this role before allowing exam creation, updating, deletion, or status
changes.

### Login

The process handled by `POST /api/auth/login`. It receives an email and
password, looks up the user in the `users` collection, and returns a JWT
and user information when the credentials pass the current checks.

### JSON Web Token (JWT)

A signed token generated using the HS256 algorithm. The supplied
authentication code sets an expiration time of 24 hours. Protected
routes use the `token_required` decorator to validate the token and look
up the user.

### Protected Endpoint

An API endpoint decorated with `token_required`. The decorator expects a
token in the `Authorization` request header and returns an error when
the token is missing or invalid.

### Role

The user attribute used by exam routes to restrict certain operations.
The supplied exam routes specifically check for the role value `admin`.

## 3. Examination Domain

### Exam

An examination represented in the MongoDB `exams` collection in the
root-level exam routes. The exam document includes an exam ID, title,
subject, duration, total marks, scheduled time, creator, and status.

### Exam ID

The identifier used to find an exam and associate its questions with it.
The supplied exam routes generate IDs with an `E` prefix, such as
`E001`.

### Exam Status

The current state of an exam. The exam status endpoint accepts
`upcoming`, `live`, or `completed`.

### Question

An item associated with an exam and stored in the MongoDB `questions`
collection by the root-level exam routes.

### Question ID

The identifier assigned to a question. The supplied exam routes generate
IDs with a `Q` prefix, such as `Q001`.

### Question Text

The text of a question presented to a student.

### Answer Options

The available options for a question. The supplied exam routes store
four option fields: `option_a`, `option_b`, `option_c`, and `option_d`.

### Correct Option

The answer option recorded in the `correct_option` field. The supplied
exam routes default this field to `A` when a value is not provided.

### Question Marks

The marks assigned to a question and stored in its `marks` field.

### Exam Duration

The allotted time for an exam, stored as `duration_minutes`.

### Total Marks

The maximum marks specified for an exam, stored as `total_marks`.

### Exam Schedule

The scheduled date or time stored in the `scheduled_at` field.

## 4. Exam Attempts and Results

### Exam Attempt

The process of a student taking an exam. The supplied result API records
a user's ID and an exam ID, but the uploaded backend files do not define
a separate persistent Exam Attempt model.

### Answer

A response selected or entered by a student. The supplied `results.py`
stores a score and warning count, but does not itself store individual
answers.

### Score

The score supplied to the results API in the `score` field. The uploaded
results route stores this value but does not calculate it.

### Result

A record submitted to `POST /api/results` in the backend configuration
that registers the results blueprint. The record contains `user_id`,
`exam_id`, `score`, `warnings`, and `timestamp`.

### Result Record

A document inserted into the MongoDB `results` collection.

### Result History

The records returned by `GET /api/results/`. The supplied results route
filters records by the authenticated user's ID.

### Timestamp

The value supplied in the result request and stored in the `timestamp`
field. The uploaded results route does not generate this value itself.

## 5. Proctoring and Activity

### Proctoring

Monitoring activity during an examination to help identify behaviour
that may violate examination rules. The README describes face detection
and activity monitoring as project features.

### Proctoring Event

An event detected or recorded during exam monitoring. The activity API
accepts JSON data and inserts it into the MongoDB `activity_logs`
collection.

### Activity Log

A document stored in the `activity_logs` collection. The activity API
provides authenticated GET and POST routes for retrieving and creating
log records.

### Warning Count

The `warnings` value stored in a result record. The uploaded
`results.py` accepts this value from the request; it does not determine
how warnings are counted.

### Face Detection

A monitoring feature described in the README. The Python files supplied
for this review do not implement the face-detection logic, so the exact
detector, event rules, and thresholds cannot be confirmed from these
backend files.

### Tab-Switch Event

A type of monitoring event described in the project README and earlier
project context. The supplied Python backend files do not implement
browser tab-switch detection; that behaviour would need to be verified
in the frontend code.

## 6. Database Terms

### MongoDB

The database technology configured by the supplied Flask applications.
Both application configurations specify the local database URI
`mongodb://localhost:27017/smartproctor`.

### `users` Collection

The collection queried by the authentication code to find a user by
email and by the token-validation utility to look up the user ID in a
JWT.

### `exams` Collection

The collection used by the root-level exam routes to list, create,
update, and delete exam documents.

### `questions` Collection

The collection used by the root-level exam routes to store questions
associated with an exam ID.

### `results` Collection

The collection used by `backend/results.py` to store result records.

### `activity_logs` Collection

The collection used by `backend/activity.py` to store activity log
records.

### MongoDB Object ID

The database identifier used for user documents. The supplied utility
converts IDs to strings when serializing documents for API responses.

## 7. Application and API Terms

### Frontend

The React-based interface described in the README. The frontend is
intended to communicate with the Flask backend through HTTP API
requests.

### Backend

The Flask application and its registered blueprints. The uploaded files
contain two configurations, and their registered routes differ.

### Blueprint

A Flask component used to group related routes. The supplied backend
files define blueprints for authentication, activity, and results. The
root-level files also define exam routes and import profile and exams
blueprints.

### Authentication API

The routes registered under `/api/auth`, including `POST /login` and
`GET /me` in the supplied authentication module.

### Activity API

The routes registered under `/api/activity`, including GET and POST
operations for activity logs and a protected test route.

### Results API

The routes registered under `/api/results` in the backend application
that registers `results_bp`. It supports saving a result and retrieving
results for the authenticated user.

### Exam API

The routes defined by the root-level `exam_routes.py` blueprint and
registered under `/api/exam` in the root-level app configuration. The
routes include listing exams, retrieving exam details, creating exams,
updating exams, deleting exams, and changing exam status.

### API Request

An HTTP request sent to a backend endpoint. Protected endpoints expect a
valid JWT in the `Authorization` header according to the supplied
utility.

## 8. Relationships Between Terms

-   A User has a role that can determine which protected operations are
    allowed.
-   An Exam contains Questions.
-   A Question belongs to an exam through its `exam_id`.
-   An Exam has a duration, total marks, scheduled time, and status.
-   A Result record associates a user with an exam using `user_id` and
    `exam_id`.
-   A Result record stores the supplied score, warning count, and
    timestamp.
-   An Activity Log stores JSON data submitted to the activity API.
-   A JWT identifies the user whose account is looked up when a
    protected request is validated.