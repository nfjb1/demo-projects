import React, { useContext, useRef, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const ContactFilter = () => {
	const contactContext = useContext(ContactContext);

	const { filterContacts, clearFilter, filtered } = contactContext;

	const searchInput = useRef('');

	useEffect(() => {
		if (filtered === null) {
			document.getElementById('contact-filter').value = '';
		}
	});

	const boxActive = () => {
		document.getElementsByClassName('box-left')[0].classList.remove('box-active');
		document.getElementsByClassName('box-right')[0].classList.add('box-active');
	};

	const onChange = (e) => {
		if (document.getElementById('contact-filter').value !== '') {
			filterContacts(e.target.value);
		} else {
			clearFilter();
		}
	};

	return (
		<FormControl onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
			<div style={{ height: '1rem' }} />
			<TextField
				ref={searchInput}
				className='contact-form-input'
				onChange={onChange}
				id='contact-filter'
				onFocus={boxActive}
				placeholder='Search for names or email addresses'
			/>
		</FormControl>
	);
};

export default ContactFilter;
