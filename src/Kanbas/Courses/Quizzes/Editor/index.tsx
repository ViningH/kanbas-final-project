import "./index.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaCircleCheck } from "react-icons/fa6";
import { Editor } from '@tinymce/tinymce-react';
import { addQuiz, updateQuiz, setQuiz, setQuizzes } from "../reducer";
import * as client from "../client";
import { KanbasState } from "../../../store";
function QuizEditor() {
    const { courseId } = useParams();
    const quiz = useSelector((state: KanbasState) => state.quizzesReducer.quiz);
    const quizList = useSelector((state: KanbasState) => state.quizzesReducer.quizzes);
    const dispatch = useDispatch();
    useEffect(() => {
        client.findQuizzesForCourse(courseId).then((quizzes) =>
            dispatch(setQuizzes(quizzes)));
    }, [courseId]);
    const navigate = useNavigate();
    const handleSave = () => {
        if (quizList.filter(q => q._id === quiz._id).length > 0) {
            client.updateQuiz(quiz).then(() => { dispatch(updateQuiz(quiz)) });
        } else {
            client.addQuiz(courseId, quiz).then((quiz) => { dispatch(addQuiz(quiz)) });
        };
        navigate(`/Kanbas/Courses/${courseId}/Quizzes`);
    };
    const handleSaveAndPublish = (quiz: { _id: any; }) => {
        if (quizList.filter(q => q._id === quiz._id).length > 0) {
            client.updateQuiz(quiz).then(() => { dispatch(updateQuiz(quiz)) });
        } else {
            client.addQuiz(courseId, quiz).then((quiz) => { dispatch(addQuiz(quiz)) });
        };
        navigate(`/Kanbas/Courses/${courseId}/Quizzes`);
    };
    return (
        <>
            <div>
                <div className="wd-align-right">
                    Points {quiz?.points} &ensp;
                    {quiz?.published ?
                        <strong className="text-success"> <FaCircleCheck /> Published &emsp;</strong> :
                        <strong>Unpublished</strong>
                    }
                    <button className="wd-standard-button" onClick={(e) => dispatch(setQuiz({ ...quiz, published: !quiz?.published }))}>⋮</button>
                </div>
                <hr />
                <ul className="nav nav-tabs wd-settings-links">
                    <li className="nav-item">
                        <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quiz._id}`} onClick={(e)=>dispatch(setQuiz(quiz))} className="nav-link active">Details</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quiz._id}/Questions`} onClick={(e)=>dispatch(setQuiz(quiz))} className="nav-link">Questions</Link>
                    </li>
                </ul>
                < br />
                <input className="form-control quiz-input-style" value={quiz?.title}
                    onChange={(e) => dispatch(setQuiz({ ...quiz, title: e.target.value }))} />
                < br />
                Quiz Instructions:
                <br />
                <Editor apiKey='o2yp55qgdndao6orwojg9p1l6ycbq5zloiq66aa5yvjagb5n'
                    onEditorChange={(newValue, editor) => {
                        dispatch(setQuiz({...quiz, description: editor.getContent()}));
                    }
                    }
                    value = {quiz?.description}
                />
                <br />
                <div className="mb-3 row">
                    <label htmlFor="quiz-type-input" className="col-3 col-form-label wd-align-text-right">Quiz Type </label>
                    <div className="col-5">
                        <select className="form-control" id="quiz-type-input" name="QUIZTYPE"
                            onChange={(e) => dispatch(setQuiz({ ...quiz, quiztype: e.target.value }))} >
                            <option value="GRADEDQUIZ">
                                Graded Quiz
                            </option>
                            <option value="PRACTICEQUIZ">
                                Practice Quiz
                            </option>
                            <option value="GRADEDSURVEY">
                                Graded Survey
                            </option>
                            <option value="UNGRADEDSURVEY">
                                Ungraded Survey
                            </option>
                        </select>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="points-input" className="col-3 col-form-label wd-align-text-right">Points </label>
                    <div className="col-5">
                        <input className="form-control" value={quiz?.points} id="points-input"
                            onChange={(e) => dispatch(setQuiz({ ...quiz, points: e.target.value }))} />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="assignment-group-input" className="col-3 col-form-label wd-align-text-right">Assignment Group </label>
                    <div className="col-5">
                        <select className="form-control" id="assignment-group-input" name="ASSIGNMENTGROUP"
                            onChange={(e) => dispatch(setQuiz({ ...quiz, group: e.target.value }))} >
                            <option value="QUIZZES">
                                Quizzes
                            </option>
                            <option value="EXAMS">
                                Exams
                            </option >
                            <option value="ASSIGNMENTS">
                                Assignments
                            </option>
                            <option value="PROJECT">
                                Project
                            </option>
                        </select>
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col-3">
                        &emsp;
                    </div>
                    <div className="col-7 wd-align-text-left">
                        <strong>Options</strong>
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col-3">
                        &emsp;
                    </div>
                    <div className="col-7 wd-align-text-left">
                        <input type="checkbox" value="SHUFFLE" name="shuffle" id="shuffle" checked={quiz?.shuffle}
                            onClick={(e) => dispatch(setQuiz({ ...quiz, shuffle: !quiz?.shuffle }))} />
                        <label htmlFor="shuffle">&nbsp; Shuffle Answers</label>
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col-3">
                        &emsp;
                    </div>
                    <div className="col-2 wd-align-text-left">
                        <input type="checkbox" value="TIMELIMIT" name="time-limit" id="time-limit" checked={quiz?.time_limit}
                            onClick={(e) => dispatch(setQuiz({ ...quiz, time_limit: !quiz?.time_limit }))} />
                        <label htmlFor="shuffle">&nbsp; Time Limit</label>
                    </div>
                    {quiz?.time_limit ?
                        <>
                            <div className="col-1">
                                <input id="time-amount" className="form-control" value={quiz?.time}
                                    onChange={(e) => dispatch(setQuiz({ ...quiz, time: e.target.value }))} />
                            </div>
                            <div className="col-3">
                                <label htmlFor="time-amount">&nbsp; Minutes</label>
                            </div>
                        </>
                        :
                        <></>
                    }

                </div>
                <div className="mb-3 row">
                    <div className="col-3">
                        &emsp;
                    </div>
                    <div className="col-7 wd-align-text-left">
                        <input type="checkbox" value="MULTIPLEATTEMPTS" name="multiattempts" id="multiattempts"
                            checked={quiz?.multiple_attempts}
                            onClick={(e) => dispatch(setQuiz({ ...quiz, multiple_attempts: !quiz?.multiple_attempts }))} />
                        <label htmlFor="multiattempts">&nbsp; Multiple Attempts</label>
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-3">
                        &emsp;
                    </div>
                    <div className="col-3 wd-align-text-left">
                        <input type="checkbox" value="SHOWCORRECT" name="show-correct" id="show-correct"
                            checked={quiz?.show_correct}
                            onClick={(e) => dispatch(setQuiz({ ...quiz, show_correct: !quiz?.show_correct }))} />
                        <label htmlFor="show-correct">&nbsp; Show Correct Answers</label>
                    </div>
                    {quiz?.show_correct ?
                        <>
                            <div className="col-2">
                                <label htmlFor="show-correct-date">&nbsp; Date Shown</label>
                            </div>
                            <div className="col-2">

                                <input type="date" id="show-correct-date" className="form-control"
                                    value={quiz?.show_correct_date}
                                    onChange={(e) => dispatch(setQuiz({ ...quiz, show_correct_date: e.target.value }))}
                                />
                            </div>
                        </>
                        :
                        <></>
                    }

                </div>
                <div className="mb-3 row">
                    <label htmlFor="code" className="col-3 col-form-label wd-align-text-right">Access Code </label>
                    <div className="col-5">
                        <input className="form-control" value={quiz?.code} id="code"
                            onChange={(e) => dispatch(setQuiz({ ...quiz, code: e.target.value }))} />
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-3">
                        &emsp;
                    </div>
                    <div className="col-7 wd-align-text-left">
                        <input type="checkbox" value="ONEQ" name="onequestion" id="onequestion"
                            checked={quiz?.one_question}
                            onClick={(e) => dispatch(setQuiz({ ...quiz, one_question: !quiz?.one_question }))} />
                        <label htmlFor="onequestion">&nbsp; One Question at a Time</label>
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-3">
                        &emsp;
                    </div>
                    <div className="col-7 wd-align-text-left">
                        <input type="checkbox" value="WEBCAM" name="webcam" id="webcam"
                            checked={quiz?.webcam}
                            onClick={(e) => dispatch(setQuiz({ ...quiz, webcam: !quiz?.webcam }))} />
                        <label htmlFor="webcam">&nbsp; Webcam Required</label>
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-3">
                        &emsp;
                    </div>
                    <div className="col-7 wd-align-text-left">
                        <input type="checkbox" value="LOCK" name="lock" id="lock" checked={quiz?.lock}
                            onClick={(e) => dispatch(setQuiz({ ...quiz, lock: !quiz?.lock }))} />
                        <label htmlFor="lock">&nbsp; Lock Questions After Answering</label>
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-3 wd-align-text-right">
                        Assign
                    </div>
                    <div className="col-7 card">
                        <div className="col-8 wd-inside-form-top">
                            <label htmlFor="assign-to"><strong>Assign to</strong></label>
                        </div>
                        <div className="col-11 wd-inside-form-card">
                            <input className="form-control" id="assign-to" value="Everyone" />
                        </div>
                        <div className="col-8 wd-inside-form-card">
                            <label htmlFor="duedate"><strong>Due</strong></label>
                        </div>
                        <div className="col-11 wd-inside-form-card">
                            <input id="duedate" className="form-control" type="date" value={quiz?.due_date}
                                onChange={(e) => dispatch(setQuiz({ ...quiz, due_date: e.target.value }))} />
                        </div>
                        <div className="col-11 wd-inside-form-card">
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="available-from"><strong>Available from</strong></label>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="until"><strong>Until</strong></label>
                                </div>
                            </div>
                        </div>
                        <div className="col-11 wd-inside-form-bottom">
                            <div className="row">
                                <div className="col-6">
                                    <input className="form-control" type="date" id="available-from"
                                        value={quiz?.start_date}
                                        onChange={(e) => dispatch(setQuiz({ ...quiz, start_date: e.target.value }))}
                                    />
                                </div>
                                <div className="col-6">
                                    <input className="form-control" type="date" id="until"
                                        value={quiz?.until_date}
                                        onChange={(e) => dispatch(setQuiz({ ...quiz, until_date: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <i className="fa fa-plus ms-2"></i> Add
                        </div>
                    </div>
                </div>
                <br />
                <hr />
                <p className="wd-inline-align">
                    <input type="checkbox" value="NOTIFYUSERS" name="notify-users" id="notify-users" />
                    <label htmlFor="notify-users">&nbsp; Notify users that this content has changed</label>
                    <span>
                        <Link to={`/Kanbas/Courses/${courseId}/Quizzes`} ><button className="wd-standard-button">Cancel</button></Link>
                        <Link to={`/Kanbas/Courses/${courseId}/Quizzes`}><button className="wd-standard-button" onClick={() => handleSaveAndPublish({...quiz, published: true})}>Save & Publish</button></Link>
                        <Link to={`/Kanbas/Courses/${courseId}/Quizzes`}><button className="wd-red-button" onClick={handleSave}>Save</button></Link>
                    </span>
                </p>
                <hr />
            </div >
        </>
    );
}
export default QuizEditor;