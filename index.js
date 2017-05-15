const fs=require('fs');
const rl=require('readline').createInterface(fs.createReadStream('data/FoodFacts.csv'));
let countryArray = [{country:'Netherlands',sugar:0,salt:0}, {country:'Canada',sugar:0,salt:0}, {country:'United Kingdom',sugar:0,salt:0} , {country:'United States',sugar:0,salt:0} ,{country:'Australia',sugar:0,salt:0} , {country:'France',sugar:0,salt:0} , {country:'Germany',sugar:0,salt:0} , {country:'Spain',sugar:0,salt:0}, {country:'South Africa',sugar:0,salt:0}];
let northRegion = ['United Kingdom', 'Denmark', 'Sweden','Norway'];
let centralRegion  = ['France', 'Belgium', 'Germany', 'Switzerland','Netherlands'];
let SouthRegion = ['Portugal', 'Greece', 'Italy', 'Spain', 'Croatia','Albania'];
let regions=[];
let flag=true,country=0,salt=0,sugar=0,protein=0,carbo=0,fat=0;

function processData(lineArray,regionName){
    let flag=true;
    regions.forEach(function(region){
        if(region.Region===regionName){
           region.Protein+= +lineArray[protein];
           region.Carbohydrate+= +lineArray[carbo];
           region.Fat+= +lineArray[fat];
           flag=false;
          }
    });
    if(flag){
          regions.push({
          Region:regionName,
          Protein : +lineArray[protein],
          Carbohydrate : +lineArray[carbo],
          Fat : +lineArray[fat]
         });
       }
    }

/*On line event*/
rl.on('line',function(row){
let lineArray=row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if(flag){
	    country = lineArray.indexOf("countries_en");
		salt = lineArray.indexOf("salt_100g");
		sugar = lineArray.indexOf("sugars_100g");
        protein = lineArray.indexOf("proteins_100g");
		carbo = lineArray.indexOf("carbohydrates_100g");
		fat = lineArray.indexOf("fat_100g");
	    flag=false;
    }

    /*First Json File*/
    countryArray.forEach(function(name){
        if(name.country==lineArray[country]){
          if(lineArray[sugar].length)         
             name.sugar += parseFloat(lineArray[sugar]);
          if(lineArray[salt].length)
             name.salt += parseFloat(lineArray[salt]);
        }
    });

    /*Second JSON file*/
    if(northRegion.includes(lineArray[country])){
        processData(lineArray,"northRegion");
	}
    else if(centralRegion.includes(lineArray[country])){
        processData(lineArray,"centralRegion");
    }
    else if(SouthRegion.includes(lineArray[country])){
        processData(lineArray,"southRegion");
    }
});

rl.on('close',function(){
    rl.close();
		fs.writeFile('output/StackBar.json', JSON.stringify(countryArray) , 'utf-8',function(){
			console.log('success');
		});
        	fs.writeFile('output/Multiline.json', JSON.stringify(regions) , 'utf-8',function(){
			console.log('success');
		});
		
});