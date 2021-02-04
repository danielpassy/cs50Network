import React, { useState, useEffect } from 'react'
import { Pagination } from 'react-bootstrap'


export const Paginator = (props) => {

    const [numPages, setNumPages] = useState(null)

    useEffect(() => {
        setNumPages(Math.floor(props.postCount / props.resultsPerPage))
    }, [props]);



    let items = []
    for (let number = props.currentPage - 1; number <= numPages && number <= props.currentPage + 1; number++) {
        if (number == 0) { continue }
        items.push(
            <Pagination.Item key={number} active={number === props.currentPage} onClick={() => props.changePostPage(number)}>
                {number}
            </Pagination.Item>,
        );
    }




    if (props.currentPage > 3) {
        console.log("entered here")
        items.unshift(<Pagination.Ellipsis style={{cursor: 'default'}}/>)
        items.unshift(
            <Pagination.Item key={1} active={props.currentPage === 1} onClick={() => props.changePostPage(1)}>{1}</Pagination.Item>
        )
    } else if (props.currentPage > 2) {
        items.unshift(
            <Pagination.Item key={1} active={props.currentPage === 1} onClick={() => props.changePostPage(1)}>{1}</Pagination.Item>
        )
    }




    const paginationBasic = (
        <div>
            <Pagination>{items}</Pagination>
        </div>
    );

    return (
        <div>
            {paginationBasic}
        </div>
    )
}

export default Paginator;