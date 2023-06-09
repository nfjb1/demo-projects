import styles from './Events.module.css';
import { Spacer } from '@/components/Layout';

export const Events = () => {
	return (
		<>
			<div className={styles.page}>
				<div className={styles.section_hero_element} style={{ gridColumn: 1 }}>
					<h4>Events</h4>
					<h1>
						Experience the Thrill of Seeing Your Tokenized Supercars at Our
						Events
					</h1>
				</div>
				<section
					id={styles.text_content}
					className='content'
					style={{ gridColumn: 2 }}
				>
					<h1>
						More than just an Investment: Join Our Community at Our Events
					</h1>
					<Spacer size={1} axis='vertical' />
					<p>
						As a collector of tokenized supercars, you have the unique
						opportunity to experience the thrill of driving your exclusive
						automobiles in person at our events. Our events are held regularly
						at various locations around the world and offer you the chance to
						not only see your cars in person, but also to take them out for a
						spin on the track or the open road.
					</p>
					<Spacer size={2} axis='vertical' />
					<div className='list-item'>
						<h3 className='number'>1</h3>
						<div>
							<h3>
								Meet Other Car Enthusiasts and the Team Behind Tokenized
								Supercars
							</h3>
							<p>
								At our events, you will have the opportunity to meet other
								car collectors and enthusiasts, as well as the team behind
								our tokenized supercars. This is a great opportunity to
								network and share your passion for automobiles with
								like-minded individuals. You can learn from each
								other&apos;s experiences and exchange tips and advice on
								how to manage and grow your collections.
							</p>
							<p>
								Furthermore, our team will be on hand to provide expert
								advice and support on all aspects of collecting and owning
								tokenized supercars. From technical information and
								performance data to market trends and valuation, our team
								will be able to answer all your questions and help you
								make informed decisions about your collection.
							</p>
						</div>
					</div>
					<div className='list-item'>
						<h3 className='number'>2</h3>
						<div>
							<h3>
								Learn About the Technology and Benefits of Tokenized
								Supercars
							</h3>
							<p>
								In addition to providing expert advice, our team will also
								be hosting various workshops and seminars at our events.
								These will cover a range of topics, including the latest
								developments in the automotive industry, the benefits of
								tokenization, and the future of digital assets. You can
								attend these sessions to learn more about the technology
								and the potential of tokenized supercars, as well as to
								share your insights and ideas with other collectors and
								experts.
							</p>
						</div>
					</div>
					<div className='list-item'>
						<h3 className='number'>3</h3>
						<div>
							<h3>Admire the Beauty and Performance of Your Cars</h3>
							<p>
								At our events, you will have the opportunity to see your
								cars in person and admire their beauty and performance.
								You can learn more about the unique features and
								specifications of your cars, as well as the history and
								heritage of the brands that we offer. You can also take
								the opportunity to compare your cars with those of other
								collectors and share your passion for automobiles.
							</p>
						</div>
					</div>
					<div className='list-item'>
						<h3 className='number'>4</h3>
						<div>
							<h3>Experience the Thrill of Driving Your Cars</h3>
							<p>
								In addition to seeing your cars in person, you will also
								have the chance to take them out for a spin on the track
								or the open road. Depending on the location and the type
								of event, you will be able to experience the thrill of
								driving your cars at high speeds and pushing their limits
								in a safe and controlled environment. You can also take
								the opportunity to test new cars and compare them to your
								existing collection.
							</p>
						</div>
					</div>
					<div className='list-item'>
						<h3 className='number'>5</h3>
						<div>
							<h3>Sign Up and Join Us at Our Next Event</h3>
							<p>
								To participate in our events, simply sign up on our
								website and choose the event that suits you best. We will
								provide all the necessary information and support to make
								your experience as a collector of tokenized supercars
								truly unforgettable. Join us at our next event and
								experience the thrill of driving your exclusive
								automobiles in person.
							</p>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};
