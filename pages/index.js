import Link from 'next/link';
import Head from '../components/head';
import Charts from '../components/charts';
import fetch from 'isomorphic-unfetch';
import crypto from 'crypto';


const secret = '';
const key = '';
const currency = 'USDT';
let total = 0;

const Index = props => (
  <div>
    <div>
    <Head title="Cryptofolio" />
    <div className="hero">
      <h1 className="title">CRYPTOFOLIO</h1>
      <div className="data">
        <Charts items={props.data.usdArray}/>
        <Charts items={props.data.bnbArray}/>
      </div>
    {props.data.usdArray.map(p => {
      total = total + p.angle;
    })}
    <h2>Total invested {total.toFixed(3)} $</h2>
    </div>
  </div>

    <style jsx>{`
      .hero {
        text-align:center;
        color: #333;
        padding: 20px;
        font-family: "Arial";
      }
      .data{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    `}</style>
  </div>
);

Index.getInitialProps = async function() {
  const time = await getTime();
  const query = 'timestamp='+time;
  const encrypted = crypto.createHmac('sha256', secret)
  .update(query)
  .digest('hex');
  const assetsArray = await getAssets(query, encrypted);
  const price = await getPrice(assetsArray);
  return {data: price}
};

async function getTime(){
  const resTime = await fetch('https://api.binance.com/api/v3/time',{
    method: 'GET',
    headers: {
      "Access-Control-Allow-Headers": "*"
    }
  });
  const nTime = await resTime.json();
  const time = nTime.serverTime.toString();
  return time;
}

async function getAssets(query, encrypted){
  let assetsArray = [];
  const call = await fetch('https://api.binance.com/api/v3/account' + '?' + query + '&signature=' + encrypted, {
      method: 'GET',
      headers: {
        "Access-Control-Allow-Headers": "*",
        'X-MBX-APIKEY': key
      }
    })
    .then( r => {
      return r.json();
    })
    .then( data => {
      data.balances.map(a => {
        if(a.free > 0) assetsArray.push(a);
      })
  });
  return assetsArray;
}

async function getPrice(assetsArray) {
    let usdArray = []; 
    let bnbArray = [];
    const rawPrice = await fetch('https://api.binance.com/api/v3/ticker/price',{
      method: 'GET',
      headers: {
        "Access-Control-Allow-Headers": "*"
      }
    })
    .then( r => {
      return r.json();
    }).then(data => {
      data.map(s =>{
        assetsArray.map(a =>{
          if(a.asset + currency == s.symbol){
              a.price = s.price;
              a.total = a.free * s.price;
              a.total = a.total.toFixed(3);
              a.radius = 100;
            usdArray.push({angle: Number(a.total), label:a.total + '$', subLabel:a.asset, title:a.asset});
          }
          if(a.asset+'BNB' == s.symbol){
            a.price = s.price;
              a.total = a.free * s.price;
              a.total = a.total.toFixed(3);
              a.radius = 100;
            bnbArray.push({angle: Number(a.total), label:a.total + 'BNB', subLabel:a.asset, title:a.asset});
          }
        })
      })
    })
    return {usdArray: usdArray, bnbArray: bnbArray};
}

export default Index;
