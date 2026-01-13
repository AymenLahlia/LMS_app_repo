import React from 'react'
import Layout from '../common/Layout'
import Hero from '../common/Hero'
import FeaturedCtegories from './../common/FeaturedCtegories';
import FeaturedCourses from '../common/FeaturedCourses';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedCtegories />
      <FeaturedCourses/>
    </Layout>
      
  )
}

export default Home
