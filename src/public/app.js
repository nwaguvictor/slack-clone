const socket = io('http://localhost:2022');

const params = new URL(document.location).searchParams;
const token = params.get('token');
