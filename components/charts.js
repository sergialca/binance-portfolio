import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Charts = props => (
  <div className="chartWrap">
    <HighchartsReact
          highcharts={Highcharts}
          options={props.items}
        />
        <style jsx>{`
      .chartWrap {
        width: 400px;
      }
    `}</style>
  </div>
)

export default Charts;