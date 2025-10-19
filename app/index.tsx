import { useRef, useState } from "react";
import { Button, Text, type TextProps, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

const numbersToNice = [...Array(10).keys()];
const _lineHeight = 1.1;

const Digit = ({
	children,
	fontSize,
	style,
	...rest
}: TextProps & { fontSize: number }) => {
	return (
		<Text
			{...rest}
			style={[
				style,
				{
					fontSize: fontSize,
					lineHeight: fontSize * _lineHeight,
					fontVariant: ["tabular-nums"],
					textAlign: "center",
					fontWeight: "900",
					textAlignVertical: "center",
					includeFontPadding: false,
				},
			]}
		>
			{children}
		</Text>
	);
};

const DigitList = ({
	value,
	fontSize,
	index,
}: {
	value: number;
	index: number;
	fontSize: number;
}) => {
	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: withTiming(-value * fontSize * 1, {
						duration: 400,
						easing: Easing.out(Easing.quad),
					}),
				},
			],
		};
	});

	console.log("herer: ", fontSize);

	return (
		<View style={{ height: fontSize, overflow: "hidden" }}>
			<Animated.View style={animatedStyles}>
				{numbersToNice.map((digit) => (
					<Digit key={`digit-item-${digit}`} fontSize={fontSize}>
						{digit}
					</Digit>
				))}
			</Animated.View>
		</View>
	);
};

const CustomAnimatedPrice = ({
	number,
	fontSize = 24,
}: {
	number: string;
	fontSize?: number;
}) => {
	const digits = number.split("");
	const [newFontSize, setNewFontSize] = useState(fontSize);
	const hasMeasured = useRef(false);

	return (
		<View>
			<Text>old fontsize: {fontSize} </Text>
			<Text>new fontsize: {newFontSize} </Text>
			<Digit
				fontSize={fontSize}
				numberOfLines={1}
				adjustsFontSizeToFit
				onTextLayout={(e) => {
					if (hasMeasured.current) return; // Prevent re-measuring

					const actualHeight =
						e.nativeEvent.lines[0].ascender - e.nativeEvent.lines[0].descender;
					if (Math.abs(actualHeight - newFontSize) > 0.1) {
						setNewFontSize(actualHeight);
					}
					hasMeasured.current = true;
				}}
			>
				{number}
			</Digit>
			<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
				{digits.map((digit, index) => {
					if (!Number.isNaN(parseInt(digit, 10))) {
						return (
							<DigitList
								key={`digit-item-${index}`}
								value={parseInt(digit, 10)}
								index={index}
								fontSize={fontSize}
							/>
						);
					}
					return (
						<Digit key={`digit-item-${index}`} fontSize={newFontSize}>
							{digit}
						</Digit>
					);
				})}
			</View>
		</View>
	);
};

export default function Index() {
	const [number, setNumber] = useState(988885);

	const onClick = () => {
		setNumber(Math.floor(Math.random() * 100090));
	};

	const intlNumber = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(number);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				gap: 20,
			}}
		>
			<Text style={{ fontSize: 20, marginBottom: 20 }}>
				Animated Price: {intlNumber}
			</Text>
			<CustomAnimatedPrice number={intlNumber} fontSize={120} />
			<Button title="Increase" onPress={onClick} />
		</View>
	);
}
