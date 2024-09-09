// // 需要提前安装 npm install echarts --save
// npm install echarts@5.3.3 --save

import * as echarts from 'echarts';

export default {

	// 执行信息图表（横向矩状图） // 条形图、横向柱状图
	chart1(ele, data, dataLabel) {
		/*
		ele:显示图表的标签元素；柱状图是个div的容器
		data:包含数据的数组 [100，80，13，7]
		dataLabel:包含数据的名称的数组 ['总数','通过','失败','错误']   // 柱状图名称
		*/
		//1.初始化chart01
		const chart1 = echarts.init(ele);
		let barLengths = []
		data.forEach((item) => {
			barLengths.push(data[0])
		})
		//2.配置数据
		const myColor = ['#7b8b83', '#28a745', '#ffc107', '#dc3545', '#409EFF', '#4de1cb'];
		const option = {
			//图标位置
			grid: {
				top: '3%',
				left: '20%',
				bottom: '3%'
			},
			xAxis: {
				show: false
			},
			yAxis: [{
					show: true,
					data: dataLabel,
					inverse: true,
					axisLine: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#000000',
						fontWeight: 'bold'
					}
				},
				{
					show: false,
					inverse: true,
					data: data,
					axisLabel: {
						fontSize: 12,
						color: '#00aa00'
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false
					}
				}
			],
			series: [{
					type: 'bar',
					yAxisIndex: 0,
					data: data,
					barCategoryGap: 50,
					barWidth: 12,
					itemStyle: {
						borderRadius: 6,
						color: function(params) {
							var num = myColor.length;
							return myColor[params.dataIndex % num];
						}
					}
				},
				{
					type: 'bar',
					yAxisIndex: 1,
					barCategoryGap: 50,
					data: barLengths,
					barWidth: 16,
					itemStyle: {
						color: 'none',
						borderColor: '#00c1de',
						borderWidth: 2,
						borderRadius: 6
					},
					label: {
						show: true,
						position: 'right',
						formatter: '{b}条',
						color: '#000000'
					}
				}
			]
		};
		// 渲染图表。
		chart1.setOption(option);
		return chart1
	},

	// 用例通过率图表（饼图）
	chart2(ele, datas) {
		/*
		ele：展示图表的元素  // 展示图表的元素对象
		datas: 通过率数据：格式如下  // 嵌套对象{}的数组[]
			[{
				value: 80,
				name: '通过'
			}, {
				value: 30,
				name: '失败'
			}, {
				value: 1,
				name: '错误'
			}]
		*/
		//1.初始化chart2
		const chart2 = echarts.init(ele);
		//2 图表样式配置
		const option = {
			color: ['#28a745', '#ffc107', '#dc3545', '#409EFF', '#4de1cb'],
			tooltip: {
				trigger: 'item',
				formatter: '{d}%【{c}条】',
				backgroundColor: 'rgba(250, 250, 250, 0.6)',
				borderColor: '#00aa7f',
				textStyle: {
					color: '#000',
					fontSize: '16',
					fontWeight: 'bold'
				}
			},
			legend: {
				orient: 'vertical',
				right: 10,
				bottom: 10
			},
			series: [{
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '16',
						fontWeight: 'bold',
						color: '#00aa7f'
					}
				},
				labelLine: {
					show: false
				},
				data: datas
			}]
		};
		//3、渲染图表。
		chart2.setOption(option);
		return chart2
	},

	// 折线图（通过率趋势图）
	chart3(ele, value, label) {
		/*
		ele：元素  // 元素对象
		value：通过率数组[78,80,60,90]  // 数据 在哪里显示图表
		labal：x轴刻度 ['2012-12-5','2012-12-8','2012-12-8','2012-12-12','2012-12-13']  // 每条数据的名称 x 时间点
		*/
		//1.初始化chart01
		const chart3 = echarts.init(ele);
		//2.配置数据
		let option = {
			title: {
				text: "通过率(%)",
				textStyle: {
					fontSize: 14,
					color: '#00aa7f'
				}
			},
			grid: {
				top: 50,
				bottom: 10,
				left: 20,
				right: 20,
				containLabel: true
			},
			tooltip: {
				trigger: 'item',
				formatter: '{b} :<br/> 通过率 ： {c}%',
				axisPointer: {
					lineStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
									offset: 0,
									color: 'rgba(255,255,255,0)' // 0% 处的颜色
								},
								{
									offset: 0.5,
									color: 'rgba(255,255,255,1)' // 100% 处的颜色
								},
								{
									offset: 1,
									color: 'rgba(255,255,255,0)' // 100% 处的颜色
								}
							],
							global: false // 缺省为 false
						}
					}
				}
			},
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				show: true,
				axisLabel: {
					show: false,
				},
				axisLine: {
					lineStyle: {
						color: '#00aa7f'
					}
				},
				axisTick: {
					show: false
				},
				data: label
			}],
			yAxis: [{
				show: true,
				boundaryGap: false,
				type: 'value',
				axisLabel: {

					color: '#00aa7f'

				},
				nameTextStyle: {
					color: '#fff',
					fontSize: 12,
					lineHeight: 40
				},
				splitLine: {
					lineStyle: {
						color: '#eef5f0'
					}
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#00aa7f'
					}
				},
				axisTick: {
					show: true
				}
			}],
			series: [{
				name: '通过率',
				type: 'line',
				smooth: true,
				showSymbol: true,
				symbolSize: 8,
				zlevel: 3,
				itemStyle: {
					color: '#19a3df',
					borderColor: '#a3c8d8'
				},
				lineStyle: {
					width: 2,
					color: '#19a3df'
				},
				areaStyle: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[{
								offset: 0,
								color: 'rgba(102, 208, 192, 0.8)'
							},
							{
								offset: 0.5,
								color: 'rgba(157, 241, 241, 0.4)'
							},
							{
								offset: 1,
								color: 'rgba(0, 170, 127, 0.1)'
							}
						],
						false
					)
				},
				data: value
			}]
		};
		//3.传入数据
		chart3.setOption(option);
		return chart3
	},

	// 柱状图
	chart4(ele, datas, data_label) {
		//1.初始化chart2
		const chart2_1 = echarts.init(ele);
		const option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: '{b}<br><b>用例数:{c}</b>',
				backgroundColor: 'rgba(250, 250, 250, 0.6)',
				borderColor: '#00aa7f',
				textStyle: {
					color: '#424242',
					fontSize: '16',
				}
			},
			grid: {
				top: '15%',
				right: '3%',
				left: '3%',
				bottom: '3%'
			},
			xAxis: [{
				type: 'category',
				data: data_label,
				axisLine: {
					lineStyle: {
						color: '#FFFFFF'
					}
				},
				axisLabel: {
					show: false
				},
				axisTick: {
					show: false
				}
			}],
			yAxis: [{
				axisLabel: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false,
					lineStyle: {
						color: 'rgba(0, 0, 0, 0.6)'
					}
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(255,255,255,0.12)'
					}
				}
			}],
			series: [{
				type: 'bar',
				data: datas,
				barWidth: '14px',
				itemStyle: {

					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[{
								offset: 0,
								color: 'rgba(0, 170, 127, 1.0)' // 0% 处的颜色
							},
							{
								offset: 1,
								color: 'rgba(169, 255, 205, 1.0)' // 100% 处的颜色
							}
						],
						false
					)

				},
				label: {

					show: true,
					lineHeight: 20,
					formatter: '{c}',
					position: 'top',
					textStyle: {
						color: '#000000',
						fontSize: 12
					}

				}
			}]
		};
		chart2_1.setOption(option);
		return chart2_1
	},
}
