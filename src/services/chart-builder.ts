type data = {
  labels?: string[] | null,
  datasets: Array<{
    label: string[] | string,
    data: number[] | number,
    backgroundColor: string[] | string,
    borderColor: string[] | string,
    borderWidth: number
  }>
};

export type Chart = {
  type: string,
  data: data,
  options: {
    scales: {
      x: { beginAtZero: boolean; } | null,
      y: { beginAtZero: boolean } | null
    }
  }
}

export default {
  chartFactory: (type = 'bar', {
    chartData,
    options
  }: {
    chartData: data,
    options: any
  }): Chart => {
    return ({
      type,
      data: chartData,
      options
    });
  }
}