interface GaugeCalculateProps {
	usage: number
	arcLengthCoefficient?: number
}

export const gaugeCalculate = ({
	usage,
	arcLengthCoefficient = 0.75
}: GaugeCalculateProps) => {
	const size = 220
	const strokeWidth = 18
	const radius = (size - strokeWidth) / 2

	const fullCircumference = 2 * Math.PI * radius

	const arcLength = fullCircumference * arcLengthCoefficient

	const progressOffset = Math.max(
		arcLength - (usage / 100) * arcLength,
		strokeWidth * 2
	)

	return {
		size,
		radius,
		strokeWidth,
		arcLength,
		fullCircumference,
		progressOffset
	}
}
