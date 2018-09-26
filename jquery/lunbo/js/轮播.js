function go(number) {
	var num = 0;
	var imgNum = 1;
	$('.next').click(function() {
		num++
		if(num >= number) {
			num = 0
		}
		if(imgNum >= number) {
			imgNum = 0
		}
		imgNum++
		var move = -200 * num
		$('.img-box').css('left', move + 'px');
		$('span').css('background-color', 'rgba(0,0,0,0.5)')
		$('span:eq(' + num + ')').css('background-color', 'white')
	})
	$('.up').click(function() {
		num--
		if(num < 0) {
			num = number - 1
		}
		imgNum--
		if(imgNum < 1) {
			imgNum = number
		}
		var move = -200 * num
		$('.img-box').css('left', move + 'px');
		$('span').css('background-color', 'rgba(0,0,0,0.5)')
		$('span:eq(' + num + ')').css('background-color', 'white')
	})

	function autoplay() {
		$('.box div').hover(function() {
			clearInterval(setId)
		})
		$('.box div span').hover(function() {
			clearInterval(setId)
		})
		var setId = setInterval(function() {
			num++;
			if(imgNum >= number) {
				$('span:eq(0)').css('background-color', 'white')
				num = 0;
				imgNum = 0;
			}

			var move = -200 * num
			$('.img-box').css('left', move + 'px');
			$('span').css('background-color', 'rgba(0,0,0,0.5)')
			$('span:eq(' + num + ')').css('background-color', 'white')
			imgNum++

			$('span').click(function() {
				$('span').css('background-color', 'rgba(0,0,0,0.5)');
				$(this).css('background-color', 'white');
				var popMove = $(this).html() - 1
				$('.img-box').css('left', -popMove * 200 + 'px');
				imgNum = $(this).html()
				num = $(this).html() - 1;
			})

		}, 1000)
	}

	$('.box').mouseout(function() {
		autoplay()
	})
	autoplay()
}