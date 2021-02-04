import React, { useState, useEffect } from 'react'
import { Pagination } from 'react-bootstrap'


export const Paginator = (props) => {

    const [numPages, setNumPages] = useState(null)

    useEffect(() => {
        setNumPages(Math.floor(props.postCount / props.resultsPerPage))
    }, [props]);



    let items = []
    console.log(props.currentPage, numPages)
    if (props.currentPage < numPages) {
        items.push(
            <Pagination.Item key={2} onClick={() => props.changePostPage(props.currentPage+1)}>
                Next
            </Pagination.Item>,
        );
    }
    if (props.currentPage != 1) {
        items.unshift(
            <Pagination.Item key={1} onClick={() => props.changePostPage(props.currentPage-1)}>
                Previous
            </Pagination.Item>,
        );
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