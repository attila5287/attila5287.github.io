function welcome_guests() {
	const welcome_msg =
		"Basic javascript quiz, every question needs to be answered within 30 secs!";

	const div = document.createElement( "div" );;
	const $info = document.getElementById("info");
	div.className = "text-primary";
	$info.appendChild(div);

	const h = document.createElement("h1");
	const h_icon = document.createElement("i");
	const h_text = document.createElement("i");
	h_icon.className = "text-primary fab fa-js mr-3 my-0";
	h_text.innerText = "Coding Quiz // 04";

	h.appendChild(h_icon);
	h.appendChild(h_text);
	div.appendChild(h);

	let p = document.createElement("p");
	let icon = document.createElement("h4");
	p.className = "text-info py-2";
	icon.className = "fas fa-info-circle mr-2 my-0";
	p.appendChild(icon);

	let text = document.createElement("i");
	text.innerText = welcome_msg;

	p.appendChild(text);
	div.appendChild(p);
}
