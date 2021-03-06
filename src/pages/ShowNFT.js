import React from 'react';
import { Grid, Divider, TextField, Button } from '@mui/material';
import '../App.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';


const ShowNFT = () => {

    const [listing, setListing] = useState([]);
    const [price, setPrice] = useState('');
    const [tx, setTx] = useState('');
    const [listed, setListed] = useState('');
    const [trigger, setTrigger] = useState(false);
    const [approve, setApprove] = useState(false);
    const [pending, setPending] = useState([]);
    const [tx2, setTx2] = useState(null);
    const [approved, setApproved] = useState(null);
    const [trigger2, setTrigger2] = useState(false);
    const [cancel, setCancel] = useState([]);
    const [tx3, setTx3] = useState(null);
    const [state, setState] = useState([]);
    const [trigger3, setTrigger3] = useState(false);
    const [buy, setBuy] = useState([]);
    const [tx4, setTx4] = useState(null);
    const [pending2, setPending2] = useState([]);
    const [approve2, setApprove2] = useState(false);
    const [approved2, setApproved2] = useState(null);
    const [tx5, setTx5] = useState(null);
    const [compare, setCompare] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [success, setSuccess] = useState(false);

    let location = useLocation();
    const {name} = location.state;
    const {description} = location.state;
    const {url} = location.state;
    const {tokenId} = location.state;
    const {contractAddress} = location.state;
    const {address} = location.state;
    const {listingId} = location.state;
    const {seller} = location.state;
    let {listedPrice} = location.state;
    let {nftAddress} = location.state;

    const addressTrim = (prop) => {
        let addr = prop.substring(0, 5) + '…' + prop.substring(prop.length - 4)
        return addr;
    };

    //Compare address and owner

    useEffect(() => {
        const compare = () => {
            if(address && seller && address.toLowerCase() === seller.toLowerCase()){
                    setCompare(true);
                } else {
                    setCompare(false);
                }
            }
            compare()
    }, [seller, address])

    //Initial checking        

    const initialURL = `http://localhost:3001/api/getListing`;

    useEffect(() => {
        try {
            fetch(initialURL,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({type: 'INITIATED'})
                })
                .then(response => response.json())
                .then(data => setListed(data.data))
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        try {
            fetch(initialURL,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({type: 'CANCELLED'})
                })
                .then(response => response.json())
                .then(data => setState(data.data))
        } catch (error) {
            console.log(error)
        }
    }, [listed])
    
    //Sell operation
    //In this case contractAddress = nftAddress
    const URL = `http://localhost:3001/api/marketplace`;
    const params = { address: address, contractAddress: contractAddress, tokenId: tokenId, price: price, operation: 'sell', listingId: listingId };

    useEffect(() => {
            const fetchListing = () => {
                try {
                    fetch(URL,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(params)
                        })
                        .then(response => response.json())
                        .then(data => setListing(data.data))
                } catch (error) {
                    console.log(error)
                }
            } 
    trigger && fetchListing();
    }, [trigger])

    useEffect(() => {
            const pendingTx = () => {
                try {
                    const {signatureId} = listing;
            
                    fetch(`http://localhost:3001/api/kms`,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({listing: signatureId})
                        })
                        .then(response => response.json())
                        .then(data => setTx(data.data))
                } catch (error) {
                    console.log(error)
                }
            }  
        listing.signatureId && pendingTx();
    }, [listing])

   useEffect(() => {
    
        const sendTx = async () => {
            try {
                const txConfig = JSON.parse(tx.serializedTransaction);
                txConfig.from = address;
                txConfig.nonce = undefined;
                txConfig.gasPrice = txConfig.gasPrice ? parseInt(txConfig.gasPrice).toString(16) : undefined;
                console.log(await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [txConfig],
                }));
            } catch (error) {
                console.log(error)  
              }
        }
    tx.serializedTransaction && sendTx();
   }, [tx])

   //Approval operation

    const approveURL = `http://localhost:3001/api/approve`;
    const approveParams = { tokenId: tokenId, contractAddress: contractAddress };

    useEffect(() => {
            const sendApprove = () => {   
                try {     
                    fetch(approveURL,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(approveParams)
                        })
                        .then(response => response.json())
                        .then(data => setPending(data.data))
                } catch (error) {
                    console.log(error)
                }
            }
    approve && sendApprove();
    }, [approve])

    useEffect(() => {
            const pendingTx2 = () => {
                try {
                    const {signatureId} = pending;
                    fetch(`http://localhost:3001/api/kms`,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({listing: signatureId})
                        })
                        .then(response => response.json())
                        .then(data => setTx2(data.data))
                } catch (error) {
                    console.log(error)
                } 
            } 
        pending.signatureId && pendingTx2();
    }, [pending])

    useEffect(() => {
            const sendTx2 = async () => {
                try {
                    const tx2Config = JSON.parse(tx2.serializedTransaction);
                    tx2Config.from = address;
                    tx2Config.nonce = undefined;
                    tx2Config.gasPrice = tx2Config.gasPrice ? parseInt(tx2Config.gasPrice).toString(16) : undefined;
                    const approved = console.log(await window.ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [tx2Config],
                    }))
                    approved!==null && setApproved("approved");
            } catch (error) {
                console.log(error) 
             }  
            } 
        tx2!==null && tx2.serializedTransaction && sendTx2();
       }, [tx2])

    //Cancel operation

    const cancelURL = `http://localhost:3001/api/marketplace2`;
    const cancelParams = { operation: 'cancel', listingId: listingId };

    useEffect(() => {
            const cancelListing = () => {
                try {
                    fetch(cancelURL,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(cancelParams)
                        })
                        .then(response => response.json())
                        .then(data => setCancel(data.data))
                } catch (error) {
                    console.log(error)
                }
            }
    trigger2 && cancelListing();
    }, [trigger2])

    useEffect(() => {
            const pendingTx3 = () => {
                try {
                    const {signatureId} = cancel;
                    fetch(`http://localhost:3001/api/kms`,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({listing: signatureId})
                        })
                        .then(response => response.json())
                        .then(data => setTx3(data.data))
                } catch (error) {
                    console.log(error) 
                }
            }  
        cancel.signatureId && pendingTx3();
    }, [cancel])

    useEffect(() => {
            const sendTx3 = async () => {
                try {
                    const tx3Config = JSON.parse(tx3.serializedTransaction);
                    tx3Config.from = address;
                    tx3Config.nonce = undefined;
                    tx3Config.gasPrice = tx3Config.gasPrice ? parseInt(tx3Config.gasPrice).toString(16) : undefined;
                    console.log(await window.ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [tx3Config],
                    }))
                } catch (error) {
                    console.log(error) 
                }
            }
        tx3!==null && tx3.serializedTransaction && sendTx3();
       }, [tx3])

    //Buy operation

    const buyURL = `http://localhost:3001/api/marketplace3`;
    const sendPrice = (Number(listedPrice)+0.15)
    const buyParams = { operation: 'buy', listingId: listingId, buyer: address, price: sendPrice };

    useEffect(() => {
        const buyNFT = () => {
            try {
                fetch(buyURL,
                    {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(buyParams)
                    })
                    .then(response => response.json())
                    .then(data => setBuy(data.data))
            } catch (error) {
                console.log(error)
            }
        }
trigger3 && buyNFT();
}, [trigger3])

    useEffect(() => {
        const pendingTx4 = () => {
            try {
                const {signatureId} = buy;
                fetch(`http://localhost:3001/api/kms`,
                    {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({listing: signatureId})
                    })
                    .then(response => response.json())
                    .then(data => setTx4(data.data))
            } catch (error) {
                console.log(error) 
            }
        }  
    buy.signatureId && pendingTx4();
    }, [buy])

    useEffect(() => {
        const sendTx4 = async () => {
            try {
                const tx4Config = JSON.parse(tx4.serializedTransaction);
                tx4Config.from = address;
                tx4Config.nonce = undefined;
                tx4Config.gasPrice = tx4Config.gasPrice ? parseInt(tx4Config.gasPrice).toString(16) : undefined;
                console.log(await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [tx4Config],
                }))
            } catch (error) {
                console.log(error) 
            }
        }
    tx4!==null && tx4.serializedTransaction && sendTx4();
   }, [tx4])

   //Approval 2 operation

    const approve2URL = `http://localhost:3001/api/approve2`;
    const sendPrice2 = (Number(listedPrice)+0.15)
    const approve2Params = { spender: address, amount: sendPrice2 };

    useEffect(() => {
        const sendApprove2 = () => {   
            try {     
                fetch(approve2URL,
                    {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(approve2Params)
                    })
                    .then(response => response.json())
                    .then(data => setPending2(data.data))
            } catch (error) {
                console.log(error)
            }
        }
approve2 && sendApprove2();
}, [approve2])


useEffect(() => {
    const pendingTx5 = () => {
        try {
            const {signatureId} = pending2;
            fetch(`http://localhost:3001/api/kms`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({listing: signatureId})
                })
                .then(response => response.json())
                .then(data => setTx5(data.data))
        } catch (error) {
            console.log(error)
        } 
    } 
pending2.signatureId && pendingTx5();
}, [pending2])


useEffect(() => {
    const sendTx5 = async () => {
        try {
            const tx5Config = JSON.parse(tx5.serializedTransaction);
            tx5Config.from = address;
            tx5Config.nonce = undefined;
            tx5Config.gasPrice = tx5Config.gasPrice ? parseInt(tx5Config.gasPrice).toString(16) : undefined;
            const approved = console.log(await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx5Config],
            }))
            approved2!==null && setApproved2("approved");
    } catch (error) {
        console.log(error) 
     }  
    } 
tx5!==null && tx5.serializedTransaction && sendTx5();
}, [tx5])

    return (
        <div>
            <Grid container spacing={2} pl={40} pt={10}>
                <Grid pr={8} pt={5}>
                    <img style={{ width: "90%", height: "90%"}} src={url}/>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid pt={2}>
                    <ul className='ul'>
                        <li>{name}</li>
                        <li>{description}</li>
                        <li>tokenId={tokenId}</li>
                        <li>owner={seller!==undefined && !compare ? addressTrim(seller) : addressTrim(address)}</li>
                    </ul>
                    {address!=undefined && address!=null && seller!=undefined && seller!=null && !compare && !approve2 &&
                        <ul className='ul'>
                            <li className='li'>{<TextField disabled id="outlined-basic" label="PRICE" variant="outlined" helperText="$CELO" type="number"
                                value={listedPrice = (Number(listedPrice)+0.15)}
                                InputLabelProps={{
                                    shrink: true,
                                }}/>}</li>
                            <li><Button variant="contained" onClick={()=>setApprove2(true)}>BUY</Button></li>
                        </ul>                        
                    }
                    {address!=undefined && address!=null && seller!=undefined && seller!=null && !compare && approve2 &&
                        <ul className='ul'>
                            <li className='li'>{<TextField disabled id="outlined-basic" label="PRICE" variant="outlined" helperText="$CELO" type="number"
                                value={listedPrice = (Number(listedPrice)+0.15)}
                                InputLabelProps={{
                                    shrink: true,
                                }}/>}</li>
                            <li><Button variant="contained" onClick={()=>setTrigger3(true)}>CONFIRM</Button></li>
                        </ul>                        
                    }
                    {listed && !listed.includes(listingId) && !approved && compare &&
                        <ul className='ul'>
                            <li className='li'><Button variant="contained" onClick={()=>setApprove(true)}>SELL</Button></li>
                        </ul> 
                    }
                    {listed && !listed.includes(listingId) && !approved && seller===undefined &&
                        <ul className='ul'>
                            <li className='li'><Button variant="contained" onClick={()=>setApprove(true)}>SELL</Button></li>
                        </ul> 
                    }
                    {listed && !listed.includes(listingId) && approved &&
                        <ul className='ul'>
                            <li className='li'>{<TextField required id="outlined-basic" label="PRICE" variant="outlined" helperText="$CELO" type="number"
                                value={price} onChange={(e) => setPrice(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}/>}</li>
                            <li><Button variant="contained" onClick={()=>setTrigger(true)}>CONFIRM</Button></li>
                        </ul>                        
                    }
                    {listed && listed.includes(listingId) && !state.includes(listingId) && compare &&
                        <ul className='ul'>
                            <li className='li'><Button variant="contained" onClick={()=>setTrigger2(true)}>CANCEL</Button></li>
                        </ul>
                    }
                    {listed && listed.includes(listingId) && !state.includes(listingId) && seller===undefined &&
                        <ul className='ul'>
                            <li className='li'><Button variant="contained" onClick={()=>setTrigger2(true)}>CANCEL</Button></li>
                        </ul>
                    }
                    {listed && listed.includes(listingId) && !approved && state.includes(listingId) && compare &&
                        <ul className='ul'>
                            <li className='li'><Button variant="contained" onClick={()=>setApprove(true)}>SELL</Button></li>
                        </ul> 
                    }
                    {listed && listed.includes(listingId) && !approved && state.includes(listingId) && seller===undefined &&
                        <ul className='ul'>
                            <li className='li'><Button variant="contained" onClick={()=>setApprove(true)}>SELL</Button></li>
                        </ul> 
                    }
                    {listed && listed.includes(listingId) && approved && state.includes(listingId) && compare &&
                        <ul className='ul'>
                            <li className='li'>{<TextField required id="outlined-basic" label="PRICE" variant="outlined" helperText="$CELO" type="number"
                                value={price} onChange={(e) => setPrice(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}/>}</li>
                            <li><Button variant="contained" onClick={()=>setTrigger(true)}>CONFIRM</Button></li>
                        </ul>                        
                    }
                    {listed && listed.includes(listingId) && approved && state.includes(listingId) && seller===undefined &&
                        <ul className='ul'>
                            <li className='li'>{<TextField required id="outlined-basic" label="PRICE" variant="outlined" helperText="$CELO" type="number"
                                value={price} onChange={(e) => setPrice(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}/>}</li>
                            <li><Button variant="contained" onClick={()=>setTrigger(true)}>CONFIRM</Button></li>
                        </ul>                        
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default ShowNFT;