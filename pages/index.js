import Head from '../components/head';
import Charts from '../components/charts';
import fetch from 'isomorphic-unfetch';
import crypto from 'crypto';

const secret = 'GD64CFKj42KuD8QsDxTKBsgkvjHtXVWiKjw4CZ8ranwfrjJ3KRR840TLYoqcNAq9';
const key = 'KSp047eoe4r2CxNGQHfrvIBGp5Bbi2dOxdCjza3NLnTByvMPm3C8k5kb0IxKs5Yr';
const currency = 'USDT';
let total = 0;
let options = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },
  title: {
    text: 'Assets'
  },
  tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.3f}$</b>'
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: true
          },
          showInLegend: true
      }
  },
  series: [{
    name: 'Invested',
    data: []
  }]
}

const Index = props => (
  <div>
    <div>
    <Head title="Cryptofolio" />
    <div className="hero">
      <h1 className="title">CRYPTOFOLIO</h1>
      {props.data.usdArray.map(p => {
        total = total + p.angle;
        options.series[0].data.push({y: p.angle, name: p.title})
      })}
      <div className="data">
        <Charts items={options}/>
      </div>
    <p className="total">Total invested {total.toFixed(3)}$</p>
    </div>
  </div>

    <style jsx>{`
      
      .hero {
        text-align:center;
        color: #333;
        padding: 20px;
        font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
      }
      .data{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      .total{
        font-size: 18px;
        color: #333333;
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
    const rawPrice = await fetch('https://api.binance.com/api/v3/ticker/price',{
      method: 'GET',
      headers: {
        "Access-Control-Allow-Headers": "*"
      }
    })
    .then( r => {
      return r.json();
    }).then(data => {
      data.map(s => {
        assetsArray.map(a =>{
          if(a.asset + currency == s.symbol){
              a.total = a.free * s.price;
              a.total = a.total.toFixed(3);
            usdArray.push({angle: Number(a.total), title:a.asset});
          }
        })
      })
    })
    return {usdArray};
}

export default Index;
