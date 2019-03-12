let data = {
	report: {},
	browser: {},
	instance: {},
	headers: {},
	latency: {},
	meta: {}
};

function render() {
	$('#pasteCollapse .card').html((btoa(JSON.stringify(data, null, 2))));
	let b = data['browser'];
	$('.browser-version').text(b['version']);
	$('.browser-language').text(b['language']);
	$('.browser-platform').text(b['platform']);
	$('.browser-product').text(b['product']);
	$('.browser-ua').text(b['userAgent']);
}

function browserInfo() {
	data['browser']['browser'] = navigator.appName;
	data['browser']['codename'] = navigator.appCodeName;
	data['browser']['version'] = navigator.appVersion;
	data['browser']['online'] = navigator.onLine;
	data['browser']['language'] = navigator.language;
	data['browser']['platform'] = navigator.platform;
	data['browser']['product'] = navigator.product;
	data['browser']['userAgent'] = navigator.userAgent;

	render();
}

function instanceForm() {
	$('#instanceInput').on('change keyup paste', function() {
		let el = $(this);
		let val = el.val();
		try {
			let parser = new URL(val);
			if(parser.protocol !== 'https:' || !parser.hostname || parser.hostname.indexOf('.') == -1) {
				return;
			}
			$('#instanceForm button[type="submit"]').removeAttr('disabled').removeClass('disabled');
		} catch(e) {

		}
	});
}

function fetchInstanceData(baseUrl) {
	let instanceUrl = baseUrl + '/api/nodeinfo/2.0.json';

	axios.get(instanceUrl)
	.then(function(res) {
		data['instance']['url'] = baseUrl;
		data['instance']['nodeinfo'] = res.data;
		data['headers'] = res.headers;

		let card = '<p class="mb-0 text-success">Successfully reached this instance.</p>';
		$('.instance-card').html(card);
		Object.keys(data['headers']).forEach(k => {
			let el = $('<p>').addClass('mb-0');
			let type = $('<span>').addClass('font-weight-bold').text(k + ': ');
			let val = $('<span>').text(data['headers'][k]);
			el = el.append(type, val);
			$('.response-headers').append(el);
		});
	}).catch(function(err) {
		console.log('error: ' + err);
	});
}

$('#instanceForm').submit(function(e) {
	e.preventDefault();
	e.stopPropagation()
	$('#instanceForm button').attr('disabled', 'disabled').addClass('disabled');
	let instance = $('#instanceInput').val();
	let issue = $('#instanceIssue').val();
	data['report']['issue'] = issue;
	let parser = new URL(instance);
	fetchInstanceData(parser.origin);
	$('.results').removeClass('d-none');
	return false;
});

function init() {
	data['meta']['timestamp'] = (new Date().toJSON());
	browserInfo();
	instanceForm();
}

heartbeat();

setInterval(function() {
	heartbeat();
}, 5000);