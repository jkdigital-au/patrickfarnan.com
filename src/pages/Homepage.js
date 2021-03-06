import React, { useState, useEffect } from 'react';
import { client } from '../helpers/sanity';
import LoadingScreen from '../components/core/LoadingScreen';
import BlockContent from '../components/blocks/BlockContent';

const Homepage = () => {
    const [page, setPage] = useState(null);

    useEffect(() => {
        const getPage = async () => {
            const result = await client.fetch(`*[_type == 'homepage']`);
            setPage(result[0]);
        }

        getPage();
    }, []);

    if(page === null) {
        return <LoadingScreen />
    } else if (page) {
        return (
            <BlockContent content={page.content} />
        );
    }
}

export default Homepage;
