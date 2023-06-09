import styles from './Benefits.module.css';
import { Spacer } from '@/components/Layout';

export const Benefits = () => {
	return (
		<>
			<div className={styles.page}>
				<div className={styles.section_hero_element} style={{ gridColumn: 1 }}>
					<h4>Benefits</h4>
					<h1>
						Revolutionizing Ownership: Digital, Liquid, Portable, Fractional,
						Diversified
					</h1>
				</div>
				<section
					id={styles.text_content}
					className='content'
					style={{ gridColumn: 2 }}
				>
					<h1>Benefits of Investing</h1>
					<Spacer size={1} axis='vertical' />
					<p>
						Investing in supercars can be a unique and exciting way to
						diversify your portfolio and potentially earn a significant return
						on your investment. Supercars are highly sought-after luxury
						vehicles that are often limited in production, making them rare
						and valuable assets. Additionally, the market for supercars has
						seen steady growth in recent years, with some models appreciating
						in value by as much as 20% or more.
					</p>
					<Spacer size={2} axis='vertical' />
					<div className='list-item'>
						<h3 className='number'>1</h3>
						<div>
							<h3>The Potential for High Returns</h3>
							<p>
								One of the main advantages of investing in supercars is
								the potential for high returns. Because of their rarity
								and exclusivity, supercars can often fetch high prices at
								auction or in private sales. Additionally, certain models
								may see appreciation in value over time, making them a
								solid investment for the long-term.
							</p>
						</div>
					</div>
					<div className='list-item'>
						<h3 className='number'>2</h3>
						<div>
							<h3>Diversify Your Portfolio</h3>
							<p>
								Another benefit of investing in supercars is the ability
								to diversify your portfolio. While stocks and bonds may be
								the traditional investment options, adding a tangible
								asset like a supercar to your portfolio can help spread
								risk and potentially yield better returns.
							</p>
						</div>
					</div>
					<div className='list-item'>
						<h3 className='number'>3</h3>
						<div>
							<h3>Experience the Thrill of Ownership</h3>
							<p>
								In addition to the financial benefits, investing in a
								supercar also allows you to experience the thrill of
								ownership. You will have the opportunity to drive and
								enjoy your supercar, or even showcase it at events and
								gatherings. This can be a unique and enjoyable aspect of
								owning such a rare and exclusive vehicle.
							</p>
						</div>
					</div>
					<div className='list-item'>
						<h3 className='number'>4</h3>
						<div>
							<h3>Considerations Before Investing</h3>
							<p>
								While there are many advantages to investing in supercars,
								it&apos;s important to consider some factors before making
								your decision. One important factor is the market for the
								specific model you are interested in. It&apos;s also
								important to consider the cost of maintenance, storage and
								insurance. Additionally, it&apos;s worth looking into the
								regulations around owning a supercar in your location.
							</p>
						</div>
					</div>
					<div className='list-item'>
						<div>
							<h3>Overview</h3>
							<p>
								In conclusion, investing in supercars can be a unique and
								exciting way to diversify your portfolio and potentially
								earn significant returns. With the potential for high
								returns, diversification and the thrill of ownership,
								supercars can be a solid investment option for the right
								investor. As always, it&apos;s important to do your own
								research and carefully consider the factors before making
								any investment decisions.
							</p>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};
