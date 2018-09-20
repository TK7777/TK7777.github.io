function getUser($page) {
	$.get('http://192.168.15.2/gz0820web/index.php', {
		page: $page
	}, function(data) {
		var users = data.data;
		if(users.length > 0) $('tbody').empty();
		for(var i in users) {
			var tr = $('<tr/>').appendTo('tbody');
			if (users[i].gender==1) {
				users[i].gender='男'
			}else if(users[i].gender==2){
				users[i].gender='女'
			}
			$('<td/>').html(users[i].id).appendTo(tr);
			$('<td/>').html(users[i].username).appendTo(tr);
			$('<td/>').html(users[i].gender).appendTo(tr);
			$('<td/>').html(users[i].age).appendTo(tr);
		}
		if(users.length > 0) $('.pagination').empty();
		var pageing = '';
		for(var i = 1; i <= data.last_page; i++) {
			if(i == data.current_page) {
				pageing += '<li class="active"><a href="javascript:void(0)">' + i + '</a></li>';
				continue;
			}
			pageing += '<li><a href="javascript:getUser(' + i + ')">' + i + '</a></li>';

		}
		$('.pagination').html(pageing);
	}, 'json');
}
$(function() {
	getUser(1);
});