Before('@pending') do
  pending
end

After do
  @browser.close
end