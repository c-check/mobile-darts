
var darts = {
	
	round:{
		darts:[]
	},
	createRound:function(){
		return JSON.parse(JSON.stringify(darts.round));
	},
	player:{
		id:0,
		name:'',
		rounds:[],
		marks:0,
		points:0,
		wins:0
	},
	createPlayer:function(id,name){
		var p=JSON.parse(JSON.stringify(darts.player));
		p.id=id;
		p.name=name;
		return p;
	},
	players:[],
	getPlayers:function(){
		var temp=localStorage.getItem('DARTSplayers');
		if(temp){
			darts.players=JSON.parse(temp);
		}
		return darts.players;
	},
	setPlayers:function(pArray){
		localStorage.setItem('DARTSplayers',JSON.stringify(pArray));
		darts.players=pArray;
		return true;
	},
	resetPlayerCaches:function(resetWins){
		var pArray=darts.getPlayers();
		for(var i in pArray){
			pArray[i].rounds=[];
			pArray[i].marks=0;
			pArray[i].points=0;
			if(resetWins===true){
				pArray[i].wins=0;
			}
		}
		darts.setPlayers(pArray);
	},
	activePlayer:0,
	getActivePlayer:function(){
		var temp=localStorage.getItem('DARTSactivePlayer');
		darts.activePlayer=temp?parseInt(temp):0;
		return darts.activePlayer;
	},
	setActivePlayer:function(i){
		darts.activePlayer=i;
		localStorage.setItem('DARTSactivePlayer',i);
		return true;
	},
	
	setupStep:'',
	getSetupStep:function(){
		darts.setupStep=localStorage.getItem('DARTSsetupStep');
		console.log('retrieving setup step from LS: '+darts.setupStep);
		return darts.setupStep;
	},
	setSetupStep:function(str){
		console.log('setting setup step to '+str);
		darts.setupStep=str;
		localStorage.setItem('DARTSsetupStep',str);
		return true;
	},
	gameType:'',
	getGameType:function(){
		darts.gameType=localStorage.getItem('DARTSgameType');
		console.log('retrieving setup step from LS: '+darts.gameType);
		return darts.gameType;
	},
	setGameType:function(str){
		console.log('setting setup step to '+str);
		darts.gameType=str;
		localStorage.setItem('DARTSgameType',str);
		return true;
	},

	handlePlayerTabUpdate:function(){
		var pArray=[];
		$('#playing > a').each(function(){
			pArray.push(darts.createPlayer($(this).attr('id_no'),$(this).html()));
		});
		darts.setPlayers(pArray);
	},
	handlePlayerTabClick:function(){
		if($(this).parent().attr('id')=='playing'){
			$('#bench').append($(this).remove());
		}
		else{
			$('#playing').append($(this).remove());
		}
		darts.handlePlayerTabUpdate();
	},
	setupPlayerTabs:function(){
		$('body').on('click','.player',darts.handlePlayerTabClick);
		var options = {
			axis:'y',
			connectWith:'.player-container',
			cursor:'move',
			distance:3,
			forcePlaceholderSize:true,
			placeholder:'player',
			cursorAt:{top:5},
			update:darts.handlePlayerTabUpdate
		};
		$('.player-container').sortable(options);
	},
	displayChoosePlayers:function(){
		darts.setSetupStep('players');
		darts.setupPlayerTabs();
		$('.game').hide();
		$('#choose-game').addClass('hidden');
		$('#choose-players').removeClass('hidden');
	},
	handleResumeGameClick:function(){
		pArray=darts.getPlayers();
		if(pArray.length<2){
			return false;
		}
		darts.setupGame(darts.getGameType());
	},
	handleFinishChoosingPlayersClick:function(){
		$('#setup-errors').empty();
		if(darts.players.length<2){
			$('#setup-errors').html('Please choose more than 1 player.');
		}
		else{
			darts.displayChooseGame();
		}
		return false;
	},
	displayChooseGame:function(){
		var pArray=darts.getPlayers();
		if(pArray.length<2){
			darts.displayChoosePlayers();
		}
		if(pArray[0].rounds.length>0){
			$('#choose-game .game-group').first().before('<h2><a id="resume-game">Resume Game</a></h2>');
		}
		var newList='';
		for(var i in darts.players){
			newList+='<br />'+darts.players[i].name;
		}
		$('#cg-players-list').html(newList);
		$('.game').hide();
		$('#setup').addClass('hidden');
		$('#choose-game').removeClass('hidden');
		darts.setSetupStep('choose-game');
		return true;
	},
	handleGameSelectClick:function(){
		darts.resetPlayerCaches(false);
		darts.setupGame($(this).attr('id'));
	},
	addPreviouslySelectedPlayers:function(){
		var pArray=darts.getPlayers(),
		removeIds=[],
		j=0;
		for(var i in pArray){
			//-player is gone?
			if($('#p'+pArray[i].id).length==0){
				removeIds.push(i);
			}
			//-player is playing
			else{
				$('#playing').append($('#p'+pArray[i].id).remove());
			}
		}
		var run=removeIds.length;
		for(;j<run;j++){
			pArray.splice(removeIds[j]-j,1);
		}
		darts.setPlayers(pArray);
	},
	initializeCurrentStep:function(){
		switch(darts.getSetupStep()){
			case 'choose-game':
				$('#finish-choosing-players').click();
			break;
			case 'cricket-standard':
			case 'cricket-buttslop':
			case 'cricket-noslop':
			case 'cricket-straight':
			case 'd10-standard':
			case 'd10-buttslop':
			case 'd10-noslop':
			case 'd10-straight':
			case 'x101':
			case 'x301':
			case 'x501':
				darts.setupGame(darts.getSetupStep());
			break;
			default:
				darts.displayChoosePlayers();
			break;
		}
	},
	handleDropDownMenuItemClick:function(e){
		e.stopPropagation();
		$('.game-active .ft-menu-dd').toggle();
	},
	handleBodyClick:function(){
		$('.game .ft-menu-dd').hide();
	},
	handleQuitButtonClick:function(){
		darts.displayChooseGame();
	},
	setupSetupButtons:function(){
		//-choose players
		$('#finish-choosing-players').on('click',darts.handleFinishChoosingPlayersClick);
		//-choose game
		$('.game-group > a').on('click',darts.handleGameSelectClick);
		//-menu
		$('.ft-menu-button').on('click',darts.handleDropDownMenuItemClick);
		$('#ft-menu-quit').on('click',darts.handleQuitButtonClick);
		$('body').on('click',darts.handleBodyClick);
		$('body').on('click','#resume-game',darts.handleResumeGameClick);
		return true;
	},
	
	setupCricket:function(){
		$('#cricket').addClass('game-active');
		var original=$('.game-active .ft-player').first(),
		clone,
		pArray=darts.getPlayers(),
		api=darts.getActivePlayer();
		var run=pArray.length,
		i=1;
		original.attr('pid',pArray[0].id);
		original.find('.cell-name').html(pArray[0].name);
		for(;i<run;i++){
			clone=original.clone(true);
			clone.attr('pid',pArray[i].id);
			clone.find('.cell-name').html(pArray[i].name);
			$('.game-active .ft-players').append(clone);
		}
		//-activate previously selected player
		if(api<0||api>=$('.game-active .ft-player').length){
			darts.setActivePlayer(0);
			api=0;
		}
		//-fresh game, add first round to first play
		if(pArray[api].rounds.length==0){
			pArray[api].rounds.push(darts.createRound());
			darts.setPlayers(pArray);
		}
		//-otherwise, setup previous scores
		else{
			var run=pArray[0].rounds.length,
			j=0;
			//-j=round
			for(;j<run;j++){
				for(var m in pArray){
					if(j<=(pArray[m].rounds.length-1)){
						if(pArray[m].rounds[j].darts.length){
							for(var k in pArray[m].rounds[j].darts){
								darts.updateCricketMarks(pArray[m].rounds[j].darts[k],m);
							}
						}
					}
				}
			}
		}
		darts.activateCricketPlayer($('.game-active .ft-player').get(api));
		darts.setupCricketPlayButtons();
		$('.game-active .ft-menu-title').html(darts.getSetupStep());
	},
	setupGame:function(type){
		$('#setup,#choose-game').addClass('hidden');
		switch(type){
			//-cricket
			case 'cricket-standard':
				$('#cricket').addClass('with-points');
				darts.setupCricket();
			break;
			case 'cricket-noslop':
				$('#cricket').addClass('with-points no-slop');
				darts.setupCricket();
			break;
			case 'cricket-straight':
				$('#cricket').addClass('no-slop');
				darts.setupCricket();
			break;
			case 'cricket-buttslop':
				darts.setupCricket();
			break;
			//-drop ten
			//-x01
			//-fail
			default:
				$('#choose-game').show();
				return false;
			break;
		}
		darts.setSetupStep(type);
		darts.setGameType(type);
		console.log('setting step to '+type);
		return true;
	},
	
	addDartToPlayerRound:function(dartVal){
		var i=$('.game-active .ft-player-active').index(),
		pArray=darts.getPlayers();
		pArray[i].rounds[pArray[i].rounds.length-1].darts.push(dartVal);
		darts.setPlayers(pArray);
	},
	
	setupCricketPlayButtons:function(){
		$('.marker-cell-number').on('click',darts.handleCricketMarkerNumberClick);
		$('.marker-cell-enter').on('click',darts.handleCricketEnterClick);
		$('.marker-cell-delete').on('click',darts.handleCricketDeleteClick);
		$('.marker-cell-undo').on('click',darts.handleCricketUndoClick);
	},
	activateCricketPlayer:function(next){
		$('.game-active .ft-player').removeClass('ft-player-active');
		$(next).addClass('ft-player-active');
		$('.game-active .hud-name').html($('.game-active .ft-player-active .cell-name').html());
		darts.setActivePlayer($(next).index());
		//-update outputs
		darts.updateCricketMarkers();
		darts.updateCricketActivePlayerStats();
	},
	updateCricketSchema:function(){
		var numPlayers=$('.ft-player').length,
		numClosed,
		i=25;
		for(;i>14;i--){
			if(i==24){
				i=20;
			}
			numClosed=0;
			$('.game-active .cell-number-'+i).each(function(){
				//-cell has 3 marks
				if(parseInt($(this).attr('marks'))>2){
					numClosed++;
					if(!$('.game-active').hasClass('with-points')){
						$(this).addClass('closed');
					}
				}
				//-cell has less than 3 marks
				else{
					$(this).removeClass('closed');
				}
			});
			//-everyone has 3 marks
			if(numPlayers<=numClosed){
				$('.game-active .header-cell-number-'+i).addClass('closed');
			}
			else{
				$('.game-active .header-cell-number-'+i).removeClass('closed');
			}
		}
	},
	updateCricketMarkers:function(){
		var i=25;
		for(;i>14;i--){
			if(i==24){
				i=20;
			}
			if($('.game-active .header-cell-number-'+i).hasClass('closed')||$('.game-active .ft-player-active .cell-number-'+i).hasClass('closed')){
				$('.marker-cell-number-'+i).addClass('disabled').removeClass('can-score');
			}
			else if($('.game-active .ft-player-active .cell-number-'+i).hasClass('marks-3')){
				$('.marker-cell-number-'+i).removeClass('disabled').addClass('can-score');
			}
			else{
				$('.marker-cell-number-'+i).removeClass('disabled').removeClass('can-score');
			}
		}
	},
	updateCricketActivePlayerStats:function(){
		var rounds=parseInt($('.game-active .round').attr('round')),
		marks=0,
		firstPoints=0,
		secondPoints=0,
		activePoints,
		thisPoints,
		pointDifference,
		pArray=darts.getPlayers(),
		api=darts.getActivePlayer();
		//-rounds
		$('.game-active .round').html('Round:'+pArray[api].rounds.length);
		//-HUD
		//-plus/minus
		$('.game-active .ft-player .cell-points').each(function(){
			thisPoints=parseInt($(this).html());
			if(thisPoints>=firstPoints){
				firstPoints=thisPoints;
			}
			else{
				if(thisPoints>=secondPoints){
					secondPoints=thisPoints;
				}
			}
			if($(this).parent().hasClass('ft-player-active')){
				activePoints=thisPoints;
			}
		});
		if(activePoints==firstPoints){
			$('.game-active .plus_minus').addClass('leading');
			$('.game-active .plus_minus').html('+'+(firstPoints-secondPoints));
		}
		else{
			$('.game-active .plus_minus').removeClass('leading');
			$('.game-active .plus_minus').html(parseInt(activePoints-firstPoints));
		}
		//-STATS BAR
		//-update marks and marks/round
		$('.game-active .ft-player-active .cell-number').each(function(){
			marks+=parseInt($(this).attr('marks'));
		});
		$('.game-active .marks-total').html('Marks:'+marks);
		$('.game-active .marks-round').html('Mks/Rd:'+(Math.round((marks/rounds)*10)/10));
		//-update points/round
		if($('.game-active').hasClass('with-points')){
			var ptsRd=Math.round((parseInt($('.game-active .ft-player-active .cell-points').html())/rounds)*10)/10;
			$('.game-active .points-round').html('Pts/Rd:'+ptsRd);
		}
		//-update wins
		$('.game-active .wins').html('Wins: '+pArray[api].wins);
		//-store stats
		for(var i in pArray){
			if(pArray[i].id==api){
				pArray[i].marks=marks;
				pArray[i].points=activePoints;
				darts.setPlayers(pArray);
				break;
			}
		}
	},
	updateCricketCellIcon:function(cell){
		$(cell).removeClass('marks-1').removeClass('marks-2').removeClass('marks-3');
		var marks=parseInt($(cell).attr('marks'));
		if(marks>=3){
			$(cell).addClass('marks-3');
		}
		else{
			$(cell).addClass('marks-'+marks);
		}
	},
	updateCricketMarks:function(dartVal,pi,addToCache){
		//-get corresponding cell
		var player=$('.game-active .ft-player').get(pi);
		var c=$(player).find('.cell-number-'+dartVal);
		//-add mark
		c.attr('marks',parseInt(c.attr('marks'))+1);
		$('.game-active .marks-total').attr('marks',parseInt($('.game-active .marks-total').attr('marks'))+1);
		var marks=parseInt(c.attr('marks'));
		//-update icon
		darts.updateCricketCellIcon(c);
		//-check/add points
		if($('.game-active').hasClass('with-points')&&marks>3){
			var target=$(player).find('.cell-points');
			target.html((parseInt(target.html())+dartVal));
		}
		//-update schema
		darts.updateCricketSchema();
		//-update markers
		darts.updateCricketMarkers();
		//-update stats
		darts.updateCricketActivePlayerStats();
		//-update player round log
		if(addToCache===true){
			darts.addDartToPlayerRound(dartVal);
		}
	},
	handleCricketMarkerNumberClick:function(){
		if($(this).hasClass('disabled')){
			return false;
		}
		darts.updateCricketMarks(parseInt($(this).attr('num')),darts.getActivePlayer(),true);
	},
	removeCricketDarts:function(a){
		var pArray=darts.getPlayers(),
		api=darts.getActivePlayer(),
		i=a===true?100:1,
		c,lastDart,marks;
		while(0<i--&&pArray[api].rounds[pArray[api].rounds.length-1].darts.length>0){
			//-get last dart
			lastDart=pArray[api].rounds[pArray[api].rounds.length-1].darts.pop();
			console.log('removing dart ('+lastDart+') for index: '+api);
			//-find corresponding cell and marks
			c=$('.game-active .ft-player-active .cell-number-'+lastDart);
			marks=parseInt(c.attr('marks'));
			c.attr('marks',(marks-1));
			//-update icon
			darts.updateCricketCellIcon(c);
			if($('.game-active').hasClass('with-points')&&marks>3){
				var target=$('.game-active .ft-player-active .cell-points');
				target.html((parseInt(target.html())-lastDart));
			}
		}
		//-update schema//-update schema
		darts.updateCricketSchema();
		//-update markers
		darts.updateCricketMarkers();
		//-update stats
		darts.updateCricketActivePlayerStats();
		//-save players
		darts.setPlayers(pArray);
		return true;
	},
	handleCricketUndoClick:function(){
		var pArray=darts.getPlayers(),
		cur=$('.game-active .ft-player-active'),
		api=darts.getActivePlayer();
		//-if player has darts, undo them
		if(pArray[api].rounds[pArray[api].rounds.length-1].darts.length){
			darts.removeCricketDarts(true);
		}
		//-go back to previous player
		else{
			//-find previous
			if(cur.prev().length){
				darts.activateCricketPlayer(cur.prev());
				pArray=darts.getPlayers();
				pArray[cur.index()].rounds.pop();
				darts.setPlayers(pArray);
			}
			else{
				console.log($('.game-active .round'));
				var rnd=parseInt($('.game-active .round').attr('round'));
				console.log(rnd);
				if(rnd>1){
					darts.activateCricketPlayer($('.game-active .ft-player').last());
					$('.game-active .round').attr('round',(rnd-1));
					pArray=darts.getPlayers();
					pArray[cur.index()].rounds.pop();
					darts.setPlayers(pArray);
				}
			}
		}
	},
	handleCricketDeleteClick:function(){
		darts.removeCricketDarts(false);
	},
	handleCricketWin:function(){
		var pArray=darts.getPlayers(),
		api=darts.getActivePlayer();
		//-display win?
		confirm(pArray[api].name+' wins!');
		//-add win
		pArray[api].wins++;
		//-store stats in db
		darts.storeStats();
		//-send first to last
		$('.game-active .ft-players').append($('.game-active .ft-player').first().remove());
		pArray.unshift(pArray.pop());
		darts.setPlayers(pArray);
		//-reset other stats
		darts.resetPlayerCaches(false);
		//-set all marks 0
		$('.game-active .cell-number').attr('marks',0).removeClass('marks-1').removeClass('marks-2').removeClass('marks-3');
		//-set points 0
		$('.game-active .cell-points').html(0);
		//-update schema
		darts.updateCricketSchema();
		//-start from top
		darts.activateCricketPlayer($('.game-active .ft-player').first());
		console.log('post reset players:');
		console.log(darts.getPlayers());
	},
	handleCricketEnterClick:function(){
		var cur=$('.game-active .ft-player-active'),
		allClosed=true,
		mostPoints=true,
		activePoints=0,
		next,
		newRnd,
		pArray=darts.getPlayers();
		//-find next player div
		if(cur.next().length){
			next=cur.next();
		}
		else{
			next=$('.game-active .ft-player').first();
			$('.game-active .round').attr('round',parseInt($('.game-active .round').attr('round'))+1);
		}
		//-check for win
		$('.ft-player-active > .cell-number').each(function(){
			if(parseInt($(this).attr('marks'))<3){
				allClosed=false;
			}
		});
		if(allClosed){
			if($('.game-active').hasClass('with-points')){
				activePoints=parseInt($('.game-active .ft-player-active .cell-points').html());
				$('.game-active .ft-player .cell-points').each(function(){
					if(activePoints<parseInt($(this).html())){
						mostPoints=false;
					}
				});
				if(mostPoints){
					darts.handleCricketWin();
					return true;
				}
			}
			else{
				darts.handleCricketWin();
				return true;
			}
		}
		//-add new round
		darts.setActivePlayer(next.index());
		pArray[next.index()].rounds.push(darts.createRound());
		darts.setPlayers(pArray);
		//-activate player
		darts.activateCricketPlayer(next);
	},
	
	storeStats:function(){
		var pArray=darts.getPlayers(),
		rounds=pArray[0].rounds.length,
		api=darts.getActivePlayer(),
		players=[],
		data;
		//-determine players
		for(var i in pArray){
			players.push(pArray[i].id);
		}
		for(var i in pArray){
			//-build data object
			console.log(data);
			data={};
			data.sess_key = $('html').attr('sess_key');
			data.id=pArray[i].id;
			data.type=darts.getSetupStep();
			data.win=i==api?1:0;
			data.rounds=rounds;
			data.points=pArray[i].points;
			data.marks=pArray[i].marks;
			data.against=JSON.stringify(players);
			//-send to php
			$.ajax(
				'/darts/store_stats',
				{
					type:'POST',
					data:data
				}
			)
		}
		return true;
	},
	
	init:function(){
		if($('body').hasClass('play')){
			darts.setupSetupButtons();
			darts.addPreviouslySelectedPlayers();
			darts.initializeCurrentStep();
		}
	}
}
$(document).ready(function(){
	window.darts.init();
});
