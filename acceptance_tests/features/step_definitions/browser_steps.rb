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