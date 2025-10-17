// src/components/Search/Search.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, AutoComplete, DatePicker, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { setSearchParams } from '@/action/search';
import { getProvinces } from '@/service/locationService';
import "./Search.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Search = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchState = useSelector(state => state.searchReducer);

  const [provinces, setProvinces] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getProvinces().then(data => {
      if (data) setProvinces(data);
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      address: searchState.address,
      dates: searchState.dates?.[0] ? [dayjs(searchState.dates[0]), dayjs(searchState.dates[1])] : null,
      guests: searchState.guests,
    });
  }, [searchState, form]);

  const handleSearch = (searchText) => {
    if (!searchText) {
      setOptions([]);
    } else {
      const filtered = provinces.filter(p =>
        p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .includes(searchText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      );
      setOptions(filtered.map(p => ({ value: p.name })));
    }
  };

  const onFinish = (values) => {
    const { address, dates, guests } = values;
    dispatch(setSearchParams({ address, dates, guests }));
  };

  return (
    <div className='search-component-wrapper'>
      <Form form={form} onFinish={onFinish} layout="inline">
        <Form.Item name="address" className="search-item search-item--location">
          <AutoComplete
            options={options}
            onSearch={handleSearch}
            placeholder="Where are you going?"
          />
        </Form.Item>
        <Form.Item name="dates" className="search-item">
          <RangePicker format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item name="guests" className="search-item">
          <Select placeholder="Number of guests">
            <Option value={1}>1 Adult</Option>
            <Option value={2}>2 Adults</Option>
            <Option value={3}>3 Adults</Option>
            <Option value={4}>4 Adults</Option>
          </Select>
        </Form.Item>
        <Form.Item className="search-item">
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Search;