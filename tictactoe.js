/*
* @Author: huhuaquan
* @Date:   2016-04-20 10:18:53
* @Last Modified by:   HectorHu
* @Last Modified time: 2016-04-25 21:27:33
*/
$(function() {
	var winResult = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
		userPlayer,
		computerPlayer,
		panel = [[0,0,0], [0,0,0], [0,0,0]],
		running = false,
		computerWin = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
		userWin = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
		firstPos = 4,
		computerVal = 1,
		userVal = -1,
		panelSize = 3,
		computerFirst;

	var Tictactoe = function() {};

	function getPosition(className) {
		return className.split(' ')[1].split('-')[1];
	}

	function oneWin() {
		for(var i = 0; i < winResult.length; i++) {
			var tmpCount = 0;
			for(var j = 0; j < winResult[i].length; j++) {
				var pos = winResult[i][j];
				if(parseInt(panel[getX(pos)][getY(pos)]) == computerVal) {
					++tmpCount;
				}
			}
			if(tmpCount === panelSize) {
				return true;
			}
		}

		return false;
	}

	function tied() {
		var dropCount = 0;
		for(var i = 0; i < panelSize; i++) {
			for(var j = 0; j < panelSize; j++) {
				if(parseInt(panel[i][j]) !== 0) {
					++dropCount;
				}
			}
		}

		return dropCount === 9;
	}

	function updatePanel(pos, val) {
		var x = getX(pos),
			y = getY(pos),
			player = (val == computerVal) ? computerPlayer : userPlayer;
		panel[x][y] = val;
		$(".grid-" + pos).html(player);
		updatePossibleWin(pos, val);
		if(oneWin()) {
			var winner = (val == computerVal) ? "Computer" : "You";
			if(confirm("Winner : " + winner + ".再来一局?")) {
				return window.location.reload();
			}
		} else if(tied()) {
			if(confirm("平局.再来一局?")) {
				return location.reload();
			}
		}
	}

	function updatePossibleWin(pos, val) {
		if(val == -1) {
			$.each(computerWin, function(index, subArr) {
				if($.inArray(parseInt(pos), subArr) !== -1) {
					computerWin[index] = undefined;
				}
			});
			computerWin = computerWin.filter(function(item) {
				return item !== undefined;
			});
		} else {
			$.each(userWin, function(index, subArr) {
				if($.inArray(parseInt(pos), subArr) !== -1) {
					userWin[index] = undefined;
				}
			});
			userWin = userWin.filter(function(item) {
				return item !== undefined;
			});
		}
	}

	function canAttack() {
		//是否可以攻击
		for(var i = 0; i < computerWin.length; i++) {
			if(computerOneEmpty(computerWin[i])) {
				return true;
			}
		}

		return false;
	}

	function userOneEmpty(winArr) {
		var emptyCount = 0;
		for(var i = 0; i < winArr.length; i++) {
			var pos = winArr[i];
			if(parseInt(panel[getX(pos)][getY(pos)]) === 0) {
				++emptyCount;
			}
		}
		return (emptyCount === 1);
	}

	function needDefend() {
		//是否需要防护
		for(var i = 0; i < userWin.length; i++) {
			if(userOneEmpty(userWin[i])) {
				return true;
			}
		}

		return false;
	}

	function findDefendPos() {
		for(var i = 0; i < userWin.length; i++) {
			if(userOneEmpty(userWin[i])) {
				for(var j = 0; j < userWin[i].length; j++) {
					var pos = userWin[i][j];
					if(parseInt(panel[getX(pos)][getY(pos)]) === 0) {
						return pos;
					}
				}
			}
		}
	}

	function computerOneEmpty(winArr) {
		var emptyCount = 0;
		for(var i = 0; i < winArr.length; i++) {
			var pos = winArr[i];
			if(parseInt(panel[getX(pos)][getY(pos)]) === 0) {
				++emptyCount;
			}
		}
		return (emptyCount === 1);
	}

	function findAttackPos() {
		var emptyCount = 0;
		for(var i = 0; i < computerWin.length; i++) {
			if(computerOneEmpty(computerWin[i])) {
				for(var j = 0; j < computerWin[i].length; j++) {
					var pos = computerWin[i][j];
					if(parseInt(panel[getX(pos)][getY(pos)]) === 0) {
						return pos;
					}
				}
			}
		}
	}

	function firstStep() {
		//第一步
		return !running;
	}

	function getY(pos) {
		return pos % panelSize;
	}

	function getX(pos) {
		return Math.floor(pos / panelSize);
	}

	function hasEmpty(winArr) {
		var emptyCount = 0;
		for(var i = 0; i < winArr.length; i++) {
			var pos = winArr[i];
			if(parseInt(panel[getX(pos)][getY(pos)]) === 0) {
				++emptyCount;
			}
		}
		return (emptyCount > 0);
	}

	function findEmptyPos() {
		var emptyCount = 0;
		for(var i = 0; i < computerWin.length; i++) {
			if(hasEmpty(computerWin[i])) {
				for(var j = 0; j < computerWin[i].length; j++) {
					var pos = computerWin[i][j];
					if(parseInt(panel[getX(pos)][getY(pos)]) === 0) {
						return pos;
					}
				}
			}
		}

		for(var i = 0; i < panelSize; i++) {
			for(var j = 0; j < panelSize; j++) {
				if(panel[i][j] == 0) {
					return i * 3 + j;
				}
			}
		}
	}

	function setPlayer(btn) {
		userPlayer = btn.html();
		computerPlayer = userPlayer === 'X' ? 'O' : 'X';
		$(".choose-player").css('display', 'none');
		$(".choose-first").css('display', 'block');
	}

	function special() {
		if(panel[0][0] == panel[2][2] && panel[0][0] == userVal
			|| panel[0][2] == panel[2][0] && panel[0][2] == userVal) {
			return true;
		} else {
			return false;
		}
	}

	function findSpecialPos() {
		if(parseInt(panel[0][1]) == 0) {
			return 1;
		} else {
			return 7;
		}
	}

	Tictactoe.prototype = {
		init: function() {
			var self = this;
			$(".xobtn").click(function() {
				setPlayer($(this));
	        });
	        $(".firstbtn").click(function() {
	        	computerFirst = ($(this).attr('id') == 'computer');
	        	$(".bg").css('display', 'none');
	        	$(".choose-panel").css('display', 'none');
	        	if(computerFirst === true) {
	        		self.play();
	        	} else {
	        		running = true;
	        	}
	        });
	        $(".grid").click(function() {
				$(this).html(userPlayer);
				updatePanel(parseInt(getPosition($(this).attr('class'))), userVal);
				self.play();
			});
		},
		play: function() {
			if(canAttack()) {
				console.log("attack");
				var attackPos = findAttackPos();
				updatePanel(attackPos, computerVal);
			} else if(needDefend()) {
				console.log("defend");
				var defendPos = findDefendPos();
				updatePanel(defendPos, computerVal);
			} else if(firstStep()) {
				console.log("first");
	            updatePanel(firstPos, computerVal);
	            running = true;
			} else {
				console.log("other");
				if(panel[1][1] == 0) {
					updatePanel(firstPos, computerVal);
					return;
				}
				if(special()) {
					console.log('special');
					var pos = findSpecialPos();
					updatePanel(pos, computerVal);
					return;
				}
				var random = Math.floor(Math.random() * 2);
				if(panel[0][0] == 0 && panel[2][2] == 0) {
					var pos = (random == 0) ? 0 : 8;
					updatePanel(pos, computerVal);
				} else if(panel[0][2] == 0 && panel[2][0] == 0) {
					var pos = (random == 0) ? 2: 6;
					updatePanel(pos, computerVal);
				} else {
					var otherPos = findEmptyPos();
					updatePanel(otherPos, computerVal);
				}
			}
		}
	};

	var ttt = new Tictactoe();
	ttt.init();
});