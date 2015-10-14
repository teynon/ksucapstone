Feature: Validating the behavior of the UI
  Background:
    Given I initialize the browser and navigate to "http://209.95.52.10/"

  Scenario: Advanced query mode is visible when the checkbox is clicked
    When I click on the Advanced draw query checkbox
    Then the Advanced query polygon button is visible
    And the Advanced query rectangle button is visible
    And the Advanced query circle button is visible

  @pending
  Scenario: Clicking on the map creates a rectangle
    When I click on the map
    Then A rectangle and results appear on the map
