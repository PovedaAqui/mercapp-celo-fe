import { Grid } from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import ActionAreaCard from "../components/ActionAreaCard";
import _, { reject } from "lodash";

const SellingNFT = ({address}) => {

    const [listingId, setListingId] = useState([]);
    const [initiated, setInitiated] = useState([]);
    const [metadata, setMetadata] = useState([]);
    const [ipfs, setIPFS] = useState([]);

    const initialURL = `http://localhost:3001/api/getListing`;
    const getInitiatedURL = `http://localhost:3001/api/getInitiated`;
    const metadataURL = `http://localhost:3001/api/getMetadata`;

    const timeOut = (t) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(`Completed in ${t}`)
          }, t)
        })
      }
        
    const getListing = async () => {
        const response = await fetch(initialURL,
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({type: 'INITIATED'})
            })
            const result = await response.json();
            return result.data;
    }
        
    const getInitiated = async () => {
        const response = listingId.map(async (data) => {
            const getInit = await fetch(getInitiatedURL,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: data})
                })
                const result = await getInit.json();
                return result.data;
        })
        const result = await response.json();
        return result;
    }
            
    const getMetadata = async () => { 
        const response = initiated.map(async (data) => {
            const getMeta = await fetch(metadataURL,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({nftAddress: data.nftAddress, tokenId: data.tokenId})
                })
                const result = await getMeta.json();
                return result;
        })
        const arrayMetadata = await Promise.all(response)
        console.log(arrayMetadata)
    }    
    
    const getIPFS = () => {
        let arrayIPFS = [];    
        metadata.map(data => {
            fetch(data)
            .then(response => response.json())
            .then(data => arrayIPFS.push(data))
            .then(data4 => data4===metadata.length && setIPFS(arrayIPFS))              
    })}

    useEffect(() => {
        Promise.all([getListing()], getInitiated()).then(result => {
            setListingId(result[0]);
            setInitiated(result[1]);
            console.log(initiated);
        });
    }, [])

    return (
        <div>
            <Grid container>
                {null}
            </Grid>
        </div>
    )
}

export default SellingNFT;