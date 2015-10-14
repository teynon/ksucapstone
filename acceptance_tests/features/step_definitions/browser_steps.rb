require 'watir-webdriver'
require 'time'

Given(/^I initialize the browser and navigate to "([^"]*)"$/) do |url|
  @browser = Watir::Browser.new
  @browser.goto url
  timeout = Time.now + 15
  until @browser.url == url || timeout <= Time.now
    sleep 1
  end
  expect(@browser.url).to eq url
end

When(/^I click on the map$/) do
  @browser.img(:src => "https://api.tiles.mapbox.com/v4/mapbox.streets/13/2412/3079.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ").click
end

Then(/^A rectangle and results appear on the map$/) do
  # <path stroke-linejoin="round" stroke-linecap="round" fill-rule="evenodd" stroke="red" stroke-opacity="0.5" stroke-width="5" fill="#f03" fill-opacity="0.25" d="M840 135L840 117L858 117L858 135z"></path>
  puts @browser.svgs.size
  expect(@browser.svgs).to be true
end

When(/^I click on the Advanced draw query checkbox$/) do
  @browser.input(:id => "draw_selection").click
end

Then(/^the Advanced query (.*) button is visible$/) do |shape|
  expect(@browser.a(:class => "leaflet-draw-draw-"+shape).visible?).to be true
end