import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useCallback, onInputChange} from 'react';
import Select, { InputActionMeta } from 'react-select';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import Item from '@mui/material/Item';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, doc, getDoc, QuerySnapshot } from 'firebase/firestore';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

var selectedUnit = null;

function App() {

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));

	const [factions, setFactions] = useState({});
	const [weapons, setWeapons] = useState({});
	const [alldata, setAlldata] = useState({});
	// const [wepsYesNo, setWepsYesNo] = useState(true);
	const [enableWeps, setEnableWeps] = useState(true)
	const [selectedUnitVal, setSelectedUnitVal] = useState()
	const [selectedWepVal, setSelectedWepVal] = useState()

	const [numberOfModels, setNumberOfModels] = useState()
	const [hitSkill, setHitSkill] = useState()
	const [hitSkillPercentage, setHitSkillPercentage] = useState()
	const [toughnessInput, setToughnessInput] = useState()
	const [armourSVInput, setArmourSVInput] = useState()
	const [totalWounds, setTotalWounds] = useState('')
	const [totalDamage, setTotalDamage] = useState('')

	const [attackText, setAttackText] = useState('');
	const [strengthText, setStrengthText] = useState('');
	const [APText, setAPText] = useState('');
	const [damageText, setDamageText] = useState('');
	const [hitPercentage, setHitPercentage] = useState('');
	const [hitValue, setHitValue] = useState('');

	var singleCheck = [];

	const handleChange = (newValue, actionMeta) => {
		console.log('HANDLE CHANGE NERE <<<<<<<<<<<<,')
		console.log(newValue.value);
		// console.log(units.newValue.value)
		// var search = 'om';
		console.log('alldata = ')
		console.log(alldata)
		setEnableWeps(false)

		if(newValue.value!=selectedUnit) {

			console.log('selectedUnit = '+selectedUnit)
			if(selectedUnit!=null) {
				console.log('setWeaponval null')
				setSelectedWepVal(null)
				setAttackText('')
				setStrengthText('')
				setAPText('')
				setDamageText('')
				setHitPercentage('')
				setHitValue('')
			}
			selectedUnit = newValue.value
			setSelectedUnitVal(selectedUnit)
			// this.setValue(null)
			// let data = docSnap.data();
			var objNames = Object.keys(alldata)
			objNames.forEach((objName, index) => {
				if(objName==newValue.value) {
					console.log('YES = ')
					console.log(objName)
					console.log(alldata[objName])
					var weaponNames = []
					var abc = alldata[objName]
					// console.log('abc = ')
					// console.log(abc['Claws'])
					var objAbc = Object.keys(abc)
					objAbc.forEach((wepName, i) => {
						console.log('wepName = '+wepName)
						weaponNames.push({
							value: wepName,
							label: wepName
						})
					})
					// setWepsYesNo(false)
					setWeapons(weaponNames)
					// console.log('wepsYesNo = '+wepsYesNo)
				} else {
					console.log('NO = ')
					console.log(objName)
				}
				if(singleCheck.includes(objName)) {
					// console.log('4')
				} else {
				}
			})
		}

		// var filterData = alldata.filter(item => item.value.includes(newValue.value));
		// console.log(filterData);
		// console.log(`action: ${actionMeta.action}`);
	};
	


	const firebaseConfig = {
		apiKey: "AIzaSyAEJwvuS8hXaqMpt91419del0ejoB62aRk",
		authDomain: "nids-157f8.firebaseapp.com",
		projectId: "nids-157f8",
		storageBucket: "nids-157f8.appspot.com",
		messagingSenderId: "773846575960",
		appId: "1:773846575960:web:905ad5962a4ad53e7ed32d",
		measurementId: "G-J2Y4QLCWHX"
	};
	
	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);
	const analytics = getAnalytics(app);
	var unitNames = [];
	var runCount = 0;

	const [units, setUnits] = useState({});

	// const handleChange = (newValue, actionMeta) => {
	const handleWepChange = (newV, actionMet) => {
		// console.log('newV = ')
		// console.log(newV.value)
		setSelectedWepVal(newV)

		console.log(alldata[selectedUnitVal][newV.value]['Attacks'])
		setAttackText(alldata[selectedUnitVal][newV.value]['Attacks'])
		setStrengthText(alldata[selectedUnitVal][newV.value]['Strength'])
		setAPText(alldata[selectedUnitVal][newV.value]['AP'])
		setDamageText(alldata[selectedUnitVal][newV.value]['Damage'])
		setHitPercentage(alldata[selectedUnitVal][newV.value]['Hit Percentage'])
		setHitValue(alldata[selectedUnitVal][newV.value]['Hit Value'])

		// console.log('allD >>>>>>>>')
		// console.log(alldata[selectedUnitVal][newV.value])
		// var objNames = Object.keys(alldata)
		// objNames.forEach((objName, index) => {
		// 	console.log('obj = '+objName)
		// 	   if(objName==newValue.value) {
		// 	   }
		// })
	};

	const updateNumbers = (at=attackText, no=numberOfModels, hp=hitPercentage, ti=toughnessInput, as=armourSVInput) => {
		// strengthText
		console.log('attackText*numberOfModels = '+at+', '+no)
		var hitSk = at*no
		console.log('hitSk = ',hitSk)
		setHitSkill(hitSk)
		// console.log('hitPercentage = ', hitPercentage)
		var toHitPerc = hp/100
		console.log('totHitPerc = ', toHitPerc)
		var dmgHitPerc = hitSk * toHitPerc
		console.log('dmgtHitPerc = ', dmgHitPerc)
		setHitSkillPercentage(dmgHitPerc)
		var stc = strToughCalc(strengthText, ti)
		console.log('stc = ',stc)
		console.log('final wounds =  = ',dmgHitPerc*stc)
		setTotalWounds(Math.round((dmgHitPerc*stc)*10)/10)
		setTotalDamage(Math.round(((dmgHitPerc*stc)*damageText)*10)/10)

		var damageCalc = as + APText
		var damageCalcAP
		if(damageCalc==1) {
			// damageCalcAP = 
		} else if(damageCalc==2) {

		} else if(damageCalc==3) {

		} else if(damageCalc==4) {

		} else if(damageCalc==5) {

		} else if(damageCalc==6) {
		}
		// Math.trunc()
	}

	const modelNoChange = (e) => {
		console.log('Model number change = ', e.target.value)
		setNumberOfModels(e.target.value)
		updateNumbers(attackText, e.target.value, hitPercentage, toughnessInput, armourSVInput)
	}

	const toughnessChange = (e) => {
		console.log('Toughness change = ', e.value)//.target.value)
		setToughnessInput(e.value)
		updateNumbers(attackText, numberOfModels, hitPercentage, e.value, armourSVInput)
	}

	const armoursvChange = (e) => {
		console.log('ArmourSv change = ', e.value)//.target.value)
		setArmourSVInput(e.value)
		updateNumbers(attackText, numberOfModels, hitPercentage, toughnessInput, e.value)
	}

	const strToughCalc = (str=strengthText, tou=toughnessInput) => {
		console.log('strToughCalc! - str = ', str, ' tou = ', tou)
		if(str==tou) {
			return 0.5
		} else if((str/2)>=tou) {
			console.log('str/2>=tou = ',str/2)
			return 0.83
		} else if ((tou/2)>=str) {
			return 0.16
		} else if(str<tou) {
			console.log('str<tou')
			return 0.33
		// } else if((str/2)<=tou) {
			// console.log('str/2<=tou = ',str/2)
			
		} else if(str>tou) {
			console.log('str>tou')
			return 0.66
		}
	}

	async function getFactions(db) {
		var factionNames = []
		const allFactions = await getDocs(collection(db, 'faction'));
		allFactions.forEach((doc) => {
				const cap = doc.id.charAt(0).toUpperCase() + doc.id.slice(1)
				factionNames.push({
					value: cap,
					label: cap
				})
			setFactions(factionNames)
		})
	}

	// const cb = useCallback(async() => {
		async function getFactions2(db, army) {
			var army = 'tyranids'
			const docRef = doc(db, 'faction', army);
			// console.log('0')
			const docSnap = await getDoc(docRef);
			// console.log('docSnap: ', docSnap.data);
	
			// console.log('1')
			if(docSnap.exists()) {
				if(runCount<1) {
					runCount++
					setAlldata(docSnap.data())
					// console.log('2')
					// console.log('Document data: ', docSnap.data());
					// const y = docSnap.docs[0].id
					let data = docSnap.data();
					// const a = QuerySnapshot.docs[0]
					// let x = a[Object.keys(a)[0]];
					var objNames = Object.keys(data)
					// console.log(objNames);
		
					
					objNames.forEach((objName, index) => {
						// console.log('3')
						// console.log(unitNames)
						// console.log(objName)
						if(unitNames.includes(objName)) {
							// console.log('4')
						} else {
							// console.log('5')
							unitNames.push({
								value: objName,
								label: objName
							})
						}
						// console.log('objName = '+objName+' i = '+index)
					})
				// console.log('units = ')
				// console.log(unitNames)
	
				
				// setUnits(objNames);
					setUnits(unitNames)
				}
			} else {
				// console.log('No such document');
			}
		}
		// }, []);

	useEffect(() =>{
		// console.log('USEEFFECT RUNNING')

		
		// updateNumbers()
		getFactions(db)
		getFactions2(db, 'tyranids')
		// getWeapons(db, 'tyranids', 'Barbgaunt')
		// cb();
	},[]);

	const toughnessOptions = [
		{ value: 1, label: 1 },
		{ value: 2, label: 2 },
		{ value: 3, label: 3 },
		{ value: 4, label: 4 },
		{ value: 5, label: 5 },
		{ value: 6, label: 6 },
		{ value: 7, label: 7 },
		{ value: 8, label: 8 },
		{ value: 9, label: 9 },
		{ value: 10, label: 10 },
		{ value: 11, label: 11 },
		{ value: 12, label: 12 },
		{ value: 13, label: 13 },
		{ value: 14, label: 14 },
		{ value: 15, label: 15 },
		{ value: 16, label: 16 },
		{ value: 17, label: 17 },
		{ value: 18, label: 18 },
		{ value: 19, label: 19 },
		{ value: 20, label: 20 }
	]

	const armSvOptions = [
		{ value: 1, label: 1 },
		{ value: 2, label: 2 },
		{ value: 3, label: 3 },
		{ value: 4, label: 4 },
		{ value: 5, label: 5 },
		{ value: 6, label: 6 },
		{ value: 7, label: 7 }
	]
	const fnpOptions = [
		{ value: 1, label: 1 },
		{ value: 2, label: 2 },
		{ value: 3, label: 3 },
		{ value: 4, label: 4 },
		{ value: 5, label: 5 },
		{ value: 6, label: 6 },
	]

	// const options = [
	// 	{ value: 'choc', label: 'fuck' },
	// 	{ value: 'strawb', label: 'ass' },
	// 	{ value: 'van', label: 'shit' }
	// ]

	// const select1 = () => (
		
	// )
	
	// useEffect(() =>{
	// 	getCities();
	// }, [])

	// const customStyles = {
	// 	option: (base, { data, isDisabled, isFocused, isSelected }) => {
	// 		return {
	// 			...base,
	// 			backgroundColor: '#282c34',
	// 			border: 'none',
	// 			margin: 0,
	// 		};
	// 	}
	// };

	return (
		<div className="App">
			<header className="App-header">
				<Grid container spacing={2} className="containerMain">
					<Grid container spacing={1}><div>&nbsp;</div></Grid>
					<Grid item xs={12} sm={6} md={2} >
						<Select
							options={factions} 
							// onChange={handleChange}
							className="select-item"
							placeholder="Select army"
							width={10}
							value={factions[0]}
							// styles={customStyles}
						/>
						<Select
							options={units} 
							onChange={handleChange}
							className="select-item"
							placeholder="Select unit"
							width={10}
						/>
						<Select 
							value={selectedWepVal} 
							isDisabled={enableWeps} 
							options={weapons} 
							onChange={handleWepChange} 
							className="select-item"
							placeholder="Select weapon"
						/>
					</Grid>
					{/* <Grid item xs={4}>
						
					</Grid>
					<Grid item xs={4}>
						
					</Grid> */}
					<Grid className="topContainer models" item xs={1}>
						<p>Number of models</p>
						<input 
							type="number" 
							name="noOfModels" 
							onChange={modelNoChange}
						/>
					</Grid>
					<Grid className="topContainer" item xs={12} sm={6} md={6} lg={2} >
						<div className="midContainer">
							<div className="textIconContainer">
								<div item className="textIcon">
									<img className="iconImg" src="icon-attack.svg" />
									Attacks: 
								</div>
								<span className="textRight">{attackText}</span>
							</div>
							<div className="textIconContainer">
								<div item className="textIcon">
									<img className="iconImg" src="icon-strength.svg" />
									Strength: 
								</div>
								<span className="textRight">{strengthText}</span>
							</div>
							<div className="textIconContainer">
								<div item className="textIcon">
									<img className="iconImg" src="icon-ap.svg" />
									AP: 
								</div>
								<span className="textRight">{APText}</span>
							</div>
							<div className="textIconContainer">
								<div item className="textIcon">
									<img className="iconImg" src="icon-damage.svg" />
									Damage: 
								</div>
								<span className="textRight">{damageText}</span>
							</div>
						</div>
					</Grid>
					<Grid item xs={12} sm={6} md={6} lg={2} >
						<div className="midContainerSelects">
							<div className="smallContainer">
								<label>Toughness: </label>
								<div className="selectContainer">
									<Select 
										item 
										className='smallSelect'
										options={toughnessOptions} 
										placeholder="TN"
										onChange={toughnessChange}
									/>
								</div>
							</div>
							<div className="smallContainer">
								<label>Armour SV: </label>
								<div className="selectContainer">
									<Select 
										item 
										className='smallSelect' 
										options={armSvOptions} 
										placeholder="SV"
										onChange={armoursvChange}
									/>
								</div>
							</div>
							<div className="smallContainer">
								<label>FNP: </label>
								<div className="selectContainer">
									<Select 
										item 
										className='smallSelect' 
										options={fnpOptions} 
										placeholder="FNP"
									/>
								</div>
							</div>
						</div>
					</Grid>
					<Grid item xs={12} sm={6} md={6} lg={3} className="topContainer">
						<div className="midContainer">
							<div className="textIconContainer">
								<div item className="textIcon">
									<img className="iconImg" src="icon-attack.svg" />
									Total wounds: 
								</div>
								<span className="textRight">{totalWounds}</span>
							</div>
							<div className="textIconContainer">
								<div item className="textIcon">
									<img className="iconImg" src="icon-strength.svg" />
									Total damage: 
								</div>
								<span className="textRight">{totalDamage}</span>
							</div>
							<div className="textIconContainer">
								<div item className="textIcon">
									<img className="iconImg" src="icon-ap.svg" />
									Post FNP: 
								</div>
								<span className="textRight">{APText}</span>
							</div>
							{/* <div className="textIconContainer">
								<div item className="textIcon">
									<img className="iconImg" src="/icon-damage.svg" />
									Damage: 
								</div>
								<span className="textRight">{damageText}</span>
							</div> */}
						</div>
					</Grid>
					<Grid container spacing={1}><div>&nbsp;</div></Grid>
				</Grid>
			</header>
		</div>
	);
}

export default App;
