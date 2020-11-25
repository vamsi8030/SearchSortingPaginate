import React, { useEffect, useState, useMemo } from "react";
import axios from 'axios';
import TableHeader from './Header';
import Pagination from './Pagination';
import Search from './Search';
import { Container, Row, Col, Jumbotron } from "react-bootstrap";
import { InputLabel, Select, MenuItem } from "@material-ui/core";

const DataTable = () => {
    const [comments, setComments] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const ITEMS_PER_PAGE = 10;

    const headers = [
        { name: "Name", field: "skill", sortable: true },
        { name: "Title", field: "title", sortable: true },
        { name: "Author", field: "author", sortable: true }
    ];

    useEffect(() => {
        const getData = () => {

            axios.get("http://localhost:2511/trainingData")
                .then(response => response.data)
                .then(data => {
                    setComments(data);
                    console.log(data);
                });
        };

        getData();
    }, []);
    const handleChange = (event) => {
        setSearch(event.target.value);
      };
    const commentsData = useMemo(() => {
        let computedComments = comments;

        if (search) {
            computedComments = computedComments.filter(
                comment =>
                    comment.skill.toLowerCase().includes(search.toLowerCase()) ||
                    comment.title.toLowerCase().includes(search.toLowerCase()) ||
                    comment.author.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedComments.length);

        //Sorting comments
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedComments = computedComments.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedComments.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [comments, currentPage, search, sorting]);

    return (
        <>

            <div className="row w-100">
                <div className="col mb-3 col-12 text-center">
                    <div className="row">
                        
                        <div className="col-md-6 d-flex flex-row-reverse">
                            <Search
                                onSearch={value => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                    <Row>
                        <Col>
                            {/*<label className="form-check-label" for="Python">Python</label>
                            <input
                                type="text"
                                id="Python"
                                className="form-check-input"
                                name="python"
                                //style={{ width: "240px" }}
                                placeholder="Search"
                                value={search}
                                onChange={e => onInputChange(e.target.value)}
                            />*/}
                            <InputLabel id="demo-simple-select-filled-label">SKILLS</InputLabel>
                            <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={search}
                            onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={"python"}>Python</MenuItem>
                                <MenuItem value={"java"}>Javaa</MenuItem>
                                <MenuItem value={"react"}>React</MenuItem>
                            </Select>
                        </Col>
                        <Col>
                            <Jumbotron>
                                <TableHeader headers={headers} onSorting={(field,order)=>setSorting({field,order})}/>
                                {
                                    commentsData.map(comment => (<Container className="border border-dark rounded-lg">
                                        <Row>
                                            <Col>{comment.title}</Col>
                                            <Col>{comment.author}</Col>
                                            <Col>{comment.skill}</Col>
                                        </Row>
                                    </Container>))
                                }
                            </Jumbotron>
                            <div className="row">
                                <div className="col-md-6 d-flex flex-row-reverse">
                                    <Pagination
                                        total={totalItems}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        currentPage={currentPage}
                                        onPageChange={page => setCurrentPage(page)}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default DataTable;